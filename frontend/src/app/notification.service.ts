
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:5400/api/notifications';

  token: any;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();

  }

  getUserNotifications() {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.get(`${this.apiUrl}/getUserNotifications`,{ headers });
  }

  markAsRead(notificationId: string) {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.put(`${this.apiUrl}/${notificationId}/markAsRead`,{ headers });
  }

  clearNotifications() {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.delete(`${this.apiUrl}/clearNotifications`,{ headers });
  }
}
 