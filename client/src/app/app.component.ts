import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  token: string;
  responseData: any;

  constructor(
    private http: HttpClient,
  ) {}

  login() {
    console.log('Logging in');
    this.http.post<{token: string}>('http://localhost:3000/auth/login', {}, {observe: 'body'}).subscribe(response => {
      this.token = response.token;
      console.log('Successfully logged in, token: ', this.token);
    });
  }

  getData() {
    this.responseData = null;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    console.log('Getting data');
    this.http.get('http://localhost:3000/api/data', {observe: 'response', headers})
    .pipe(
      map(response => response.body),
      catchError(err => {
        console.log('Error occurred: ', err);
        return of({
          error: err
        });
      })
    )
    .subscribe(response => {
      this.responseData = response;
      console.log('Successfuly get data: ', this.responseData);
    });
  }
}
