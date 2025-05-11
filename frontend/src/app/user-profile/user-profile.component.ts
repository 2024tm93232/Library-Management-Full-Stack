import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { HeaderBarComponent } from "../header-bar/header-bar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AddBookComponent } from '../add-book/add-book.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../book.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatTableModule, ReactiveFormsModule, CommonModule, HeaderBarComponent, MatTabsModule, MatMenuModule, MatIconModule, MatSelectModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  profileForm!: FormGroup;
  favoriteBookGenres: string[] = ["Adventure",
    "Biography",
    "Crime",
    "Drama",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Humor",
    "Mystery",
    "Non-Fiction",
    "Philosophical",
    "Romance",
    "Science Fiction",
    "Self-Help",
    "Spirituality",
    "Thriller",];
  booksOwned: any[] = [];
  showEdit: boolean = false;
  userData: any;

  books: any = new MatTableDataSource([]);
  displayedColumns: string[] = ['title', 'author', 'genre', 'condition', 'available', 'actions'];

  transactions: any = new MatTableDataSource([]);
  transactionColumns: string[] = ['title', 'author', 'genre', 'deliveryMethod', 'exchangeDuration', 'requestedBy', 'status', 'actions'];

  myRequests: any = new MatTableDataSource([]);
  myRequestsColumns: string[] = ['title', 'author', 'genre', 'deliveryMethod', 'exchangeDuration', 'requestedFrom', 'status'];

  constructor(private bookService: BookService, private userService: UserService, private cd: ChangeDetectorRef, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl({ value: '', disabled: true }),
      favoriteGenres: new FormControl([]),
      readingPreferences: new FormControl(''),
    });

    this.getUserProfile();
    this.getUserBooks();
    this.getUserExchangeRequests();
  }

  getUserProfile() {
    this.userService.getUserProfile().subscribe(
      (data) => {
        const profileData = {
          ...data,
          favoriteGenres: data.favoriteGenres ? data.favoriteGenres.split(', ') : []
        };
        this.profileForm.patchValue(profileData);
        this.userData = data;
      },
      // (error: any) => alert('Failed to load my posts.' + error.error.message)
    );
  }

  getUserExchangeRequests() {
    this.bookService.getUserExchangeRequests().subscribe(
      (data) => {
        let exchangeData = data;
        this.transactions = exchangeData.filter((request: any) => request.recipient.email !== this.userData.email);
        this.myRequests = exchangeData.filter((request: any) => request.recipient.email == this.userData.email);

      },
      // (error: any) => alert('Failed to load my posts.' + error.error.message)
    );
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    const profileData = {
      ...this.profileForm.value,
      favoriteGenres: this.profileForm.value.favoriteGenres.join(', ')
    };

    this.userService.updateUserProfile(profileData).subscribe(
      (response: any) => {
        this.getUserProfile();
        alert('Profile updated successfully!');
        this.showEdit = false;
      },
      (error: any) => {
        alert('Failed to update profile: ' + error.error.message);
      }
    );
  }

  getUserBooks() {
    this.bookService.getUserBooks().subscribe(
      (data) => {
        this.books = data;
      },
      (error: any) => alert('Failed to load my posts.' + error.error.message)
    );
  }

  addBook() {
    const dialogRef = this.dialog.open(AddBookComponent, {
      disableClose: true, autoFocus: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getUserBooks();
        alert('Book added successfully.');
      }
    });
  }

  editBook(book: any) {
    const dialogRef = this.dialog.open(AddBookComponent, {
      disableClose: true,
      autoFocus: false,
      data: book
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserBooks();
        alert('Book edited successfully.');
      }
    });
  }

  deleteBook(book: any) {
    const confirmed = confirm(`Are you sure you want to delete the book "${book.title}"?`);

    if (confirmed) {
      this.bookService.deleteBook(book._id).subscribe(
        () => {
          this.getUserBooks();

          alert('Book deleted successfully.');
        },
        (error: any) => alert('Failed to delete book. ' + error.error.message)
      );
    }
  }

  editProfile() {
    this.showEdit = true;
    console.log(this.showEdit);
    this.cd.detectChanges();
  }

  notifyStatusChange(transaction: any, newStatus: string) {
    alert(`Transaction for "${transaction.bookTitle}" is now "${newStatus}".`);
  }

  acceptExchangeTransaction(transaction: any) {
    const confirmed = confirm(`Are you sure you want to accept the transaction "${transaction.book.title}"?`);

    if (confirmed) {
      this.bookService.acceptExchangeRequest(transaction._id).subscribe(
        () => {
          this.getUserExchangeRequests();

          alert('Transaction accepted successfully.');
        },
        (error: any) => alert('Failed to accept book transaction')
      );
    }

    // if (transaction.status === 'Pending') {
    //   transaction.status = 'Accepted';
    //   this.notifyStatusChange(transaction, 'Accepted');
    //   this.transactions.data = [...this.transactions.data];
    // }
  }

  rejectExchangeRequest(transaction: any) {
    const confirmed = confirm(`Are you sure you want to reject the transaction "${transaction.book.title}"?`);

    if (confirmed) {
      this.bookService.rejectExchangeRequest(transaction._id).subscribe(
        () => {
          this.getUserExchangeRequests();

          alert('Transaction rejected successfully.');
        },
        (error: any) => alert('Failed to reject transaction.')
      );
    }
    // if (transaction.status === 'Pending') {
    //   transaction.status = 'Cancelled';

    //   this.notifyStatusChange(transaction, 'Cancelled');

    //   this.transactions.data = [...this.transactions.data];
    // } else {
    //   alert('This transaction cannot be cancelled.');
    // }
  }

  completeTransaction(transaction: any) {
    if (transaction.status === 'Accepted') {
      transaction.status = 'Completed';
      this.notifyStatusChange(transaction, 'Completed');
      this.transactions.data = [...this.transactions.data];
    }
  }
}
