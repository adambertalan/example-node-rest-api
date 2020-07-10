import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, takeWhile, finalize } from 'rxjs/operators';
import { of, Observable, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  token: string;
  responseData: any;
  tokenExpirationTimer: Observable<number>;
  tokenData: {
    iat: number;
    exp: number;
  };

  constructor(
    private http: HttpClient,
  ) {}

  login() {
    console.log('Logging in');
    this.http.post<{token: string}>('http://localhost:3000/auth/login', {}, {observe: 'body'}).subscribe(response => {
      this.token = response.token;
      this.extractTokenData();
      this.startExpirationTimer();
      console.log('Successfully logged in, token: ', this.token);
    });
  }

  private extractTokenData() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.token);
    this.tokenData = {
      iat: decodedToken.iat,
      exp: decodedToken.exp
    };
  }

  private startExpirationTimer() {
    this.tokenExpirationTimer = timer(0, 1000).pipe(
      map(() => {
        const nowTS = new Date().getTime();
        const remainingTimeTS = this.tokenData.exp * 1000 - nowTS;
        return remainingTimeTS;
      }),
      takeWhile(remainingTimeMS => remainingTimeMS > 0),
      finalize(() => {
        this.token = null;
      })
    );
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
