import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss'
})
export class AddBookComponent {

  addBookForm: FormGroup;
  conditions: any[] = ['New', 'Good', 'Fair'];
  isEditMode: boolean;
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

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private dialogRef: MatDialogRef<AddBookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data?._id;
    console.log(data);
    console.log(this.isEditMode);

    // Initialize the form with default values or pre-filled values for edit
    this.addBookForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      author: [data?.author || '', Validators.required],
      genre: [data?.genre || '', Validators.required],
      condition: [data?.condition || '', Validators.required],
      available: [data?.available ?? true]
    });
  }

  addBook() {
    this.addBookForm.markAllAsTouched();
    if (this.addBookForm.invalid) return;

    this.bookService.addBook(this.addBookForm.value).subscribe(
      () => {
        this.dialogRef.close('Ok');
      },
      (error: any) => alert('Failed to add book')
    );
  }

  editBook() {
    this.addBookForm.markAllAsTouched();
    if (this.addBookForm.invalid) return;

    const bookId = this.data._id;
    this.bookService.editBook(bookId, this.addBookForm.value).subscribe(
      () => {
        this.dialogRef.close('Ok');
      },
      (error: any) => alert('Failed to edit book')
    );
  }

  close() {
    this.dialogRef.close();
  }
}
