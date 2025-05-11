import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms'; 
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return; 
    }

    const { email, password } = this.loginForm.value;

    const encryptedPassword = CryptoJS.SHA256(password).toString();

    this.authService.login(email, encryptedPassword).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/home']);
        localStorage.setItem('userName', email);
      },
      (error) => alert(error.error?.message)
    );
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  signUp(){
    this.router.navigate(['/signup']);
  }

  forgotPassword(){
    this.router.navigate(['/forgotPassword']);
  }
}
