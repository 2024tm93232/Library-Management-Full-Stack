import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService } from '../auth.service';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ExchangeBookComponent } from '../exchange-book/exchange-book.component';

@Component({
  selector: 'app-book-listing',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, HeaderBarComponent, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatMenuModule, MatIconModule],
  templateUrl: './book-listing.component.html',
  styleUrl: './book-listing.component.scss'
})
export class BookListingComponent {
  displayedColumns: string[] = ['title', 'author', 'genre', 'condition', 'postedBy', 'availability', 'actions'];
  books: any = new MatTableDataSource([]);
  filteredBooks: any = new MatTableDataSource();
  filterForm: FormGroup;
  dataSource: MatTableDataSource<any>;

  genres: any = [
    "Adventure",
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
    "Thriller",
    "Other"
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private authService: AuthService, private bookService: BookService, private router: Router) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      genre: [''],
      availability: ['']
    });
    this.dataSource = new MatTableDataSource(this.filteredBooks);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.getAllBooksList();
  }

  // getAllBooks(): void {
  //   this.bookService.getAllBooks().subscribe(
  //     (data) => {
  //       this.books = data;
  //       this.filteredBooks = this.books;
  //       this.dataSource = new MatTableDataSource(this.filteredBooks);
  //       this.dataSource.paginator = this.paginator;
  //     },
  //     (error) => {
  //       console.error('Failed to fetch books:', error);
  //     }
  //   );
  // }

  getAllBooksList(): void {
    this.bookService.getAllBooksList().subscribe(
      (data) => {
        this.books = data;
        this.filteredBooks = this.books;
        this.dataSource = new MatTableDataSource(this.filteredBooks);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Failed to fetch books:', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilters() {
    const { searchTerm, genre, availability } = this.filterForm.value;
    let bookAvailability: any;
    if (availability == 'Available') {
      bookAvailability = true;
    } else if (availability == 'Unavailable') {
      bookAvailability = false;
    }
    this.filteredBooks = this.books.filter((book: any) => {
      console.log(book.available);
      const matchesSearchTerm = !searchTerm || book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !genre || book.genre === genre;
      const matchesAvailability = !availability || book.available === bookAvailability;

      return matchesSearchTerm && matchesGenre && matchesAvailability;
    });
    this.dataSource = new MatTableDataSource(this.filteredBooks);
    this.dataSource.paginator = this.paginator;
  }

  clearFilters() {
    this.filterForm.reset();
    this.filteredBooks = this.books;
    this.dataSource = new MatTableDataSource(this.filteredBooks);
    this.dataSource.paginator = this.paginator;
  }

  exchangeBook(book: any) {
    const dialogRef = this.dialog.open(ExchangeBookComponent, {
      disableClose: true, autoFocus: false,
      data: { book },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getAllBooksList();
        alert('Exchange request sent.');
      }
    });
  }
}
