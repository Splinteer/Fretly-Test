import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { User } from './user'

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseurl = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  }

  register(data): Observable<User> {
    return this.http.post<User>(this.baseurl + '/register', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandl)
    )
  }

  login(data): Observable<User> {
    return this.http.post<User>(this.baseurl + '/login', JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandl)
    )
  }

  getNbUser(): Observable<User> {
    return this.http.get<User>(this.baseurl + '/getNbUser', { withCredentials: true })
    .pipe(
      catchError(this.errorHandl)
    )
  }

  // Error handling
  errorHandl(error) {
    return throwError(error.error);
  }
}
