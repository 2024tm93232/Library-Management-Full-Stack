import { Component, Input, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatListModule, CommonModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss'
})
export class HeaderBarComponent {
  userName: string = 'Vikrant';
  @Input() profileForm : any;
  notifications: any = [];

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {
    // this.userName = this.authService.getLoggedInUserName();
    this.getUserNotifications();
  }

  home() {
    this.router.navigate(['/home']);
  }

  userProfile() {
    this.router.navigate(['/profile']);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);

  }

  getUserNotifications() {
    this.notificationService.getUserNotifications().subscribe(
      (data) => {
        this.notifications = data;
      },
      // (error: any) => alert('Failed to load my posts.' + error.error.message)
    );
  }


  markAsRead(notification: any) {
    // this.notificationService.markAsRead(notification);
  }

  clearNotifications() {
    this.notificationService.clearNotifications().subscribe(
      (data) => {
        this.notifications = [];
      },
      // (error: any) => alert('Failed to load my posts.' + error.error.message)
    );
  }
}
