import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  signupForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required]),
      }
        );
  }

  signup(): void {

    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      return;
    }

    const { email, password, confirmPassword } = this.signupForm.value;

    if (password != confirmPassword) {
      alert('Passwords do not match. Please ensure both passwords are the same.');
      return;
    }
  
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    this.authService.register(email, encryptedPassword).subscribe(
      (response) => {
        alert("Registered successfully");
        this.router.navigate(['/login']);
      },
      (error) => alert(error.error?.message)
    );
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  login(){
    this.router.navigate(['/login']);
  }
}

