import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5400/api/users';

  token: any;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }

  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  updateUserProfile(profileData: any): Observable<any> {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.put(`${this.apiUrl}/profile`, profileData, { headers });
  }
}
