import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BookListingComponent } from './book-listing/book-listing.component';

export const routes: Routes = [
    { path: 'signup', component: RegisterComponent }, 
    { path: '', component: LoginComponent }, 
    { path: 'login', component: LoginComponent }, 
    { path: 'forgotPassword', component: ForgotPasswordComponent }, 
    { path: 'home', component: BookListingComponent }, 
    { path: 'profile', component: UserProfileComponent }, 
];
