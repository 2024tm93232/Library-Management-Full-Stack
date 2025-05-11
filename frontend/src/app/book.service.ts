import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:5400/api/books';
  token: any;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }

  addBook(bookData: any): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post(`${this.apiUrl}`, bookData, { headers });
  }

  getUserBooks(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${this.apiUrl}/getUserBooks`, { headers });
  }

  getAllBooksList(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${this.apiUrl}/getAllBooksList`, { headers });
  }

  editBook(bookId: string, updatedData: any): Observable<any> {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.put(`${this.apiUrl}/${bookId}`, updatedData, { headers });
  }

  deleteBook(bookId: string): Observable<any> {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.delete(`${this.apiUrl}/${bookId}`, { headers });
  }

  sendExchangeRequest(data: any): Observable<any> {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.post(`${this.apiUrl}/sendExchangeRequest`, data, { headers });
  }

  getUserExchangeRequests(): Observable<any> {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.get(`${this.apiUrl}/getUserExchangeRequests`, { headers });
  }

  getAllBooks() {
    return this.http.get<any[]>(`${this.apiUrl}/getAllBooks`);
  }

  acceptExchangeRequest(bookId: string, ): Observable<any> {
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.put(`${this.apiUrl}/acceptExchangeRequest/${bookId}`, { headers });
  }

  rejectExchangeRequest(bookId: string, ): Observable<any> {
    console.log(this.token);
    console.log(localStorage.getItem('token'));
    const headers = this.token ? new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }) : undefined;

    return this.http.put(`${this.apiUrl}/rejectExchangeRequest/${bookId}`, { headers });
  }

}


