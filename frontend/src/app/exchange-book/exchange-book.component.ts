import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './exchange-book.component.html',
  styleUrl: './exchange-book.component.scss'
})
export class ExchangeBookComponent {

  exchangeBookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private dialogRef: MatDialogRef<ExchangeBookComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.exchangeBookForm = this.fb.group({
      deliveryMethod: ['', Validators.required],
      exchangeDuration: ['', Validators.required]
    });
  }

  sendExchangeRequest() {
    this.exchangeBookForm.markAllAsTouched();

    if (this.exchangeBookForm.invalid) {
      return;
    }

    const exchangeRequest = {
      bookId: this.data.book._id,
      deliveryMethod: this.exchangeBookForm.value.deliveryMethod,
      exchangeDuration: this.exchangeBookForm.value.exchangeDuration,
    };

    this.bookService.sendExchangeRequest(exchangeRequest).subscribe(
      (response) => {
        this.dialogRef.close("ok");
      },
      (error) => {
        alert(error.error?.message);
      }
    );

  }

  close() {
    this.dialogRef.close();
  }

}

