import { Injectable, OnDestroy, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap, Subscription, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy{
  baseUrl: string = environment.apiUrl;
  private router: Router = inject(Router);
  private subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private routes: Router) {}

  public get user(): User | null {
    const token = localStorage.getItem('user_token');
    if (token) {
      const user: User = this.parseJwt(token);
      return user;
    }
    return null;
  }

  public logIn(formData: {email: string, password: string}) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, {email: formData.email, password: formData.password}, this.httpOptions)
    .pipe(
      map((res) => {
        if (res.token) {
          localStorage.setItem('user_token', res.token);
          this.router.navigate(['nav/all']);
        }
        return null;
      }),
      takeUntil(this.destroy$),
      catchError((e): Observable<null> => {
        localStorage.removeItem('user_token');
        alert(e.error.message);
        return of(null);
      })
    ).subscribe();
  }

  public get token(): string | null {
    const token = localStorage.getItem('user_token');
    return token;
  }

  private parseJwt(token: string): User {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  logout() {
    localStorage.removeItem('user_token');
    this.router.navigate(['nav/auth']);
  }

  public signup(formData: {email: string, password: string, fullname: string})
  {
    return this.http.post(`${this.baseUrl}/auth/registration`, {email: formData.email, password: formData.password, fio: formData.fullname}, this.httpOptions)
    .pipe(
      tap((res) => {
        console.log(res);
        this.router.navigate(['nav/auth']);
      }),
      takeUntil(this.destroy$),
      catchError((): Observable<null> => {
        return of(null);
      })
    ).subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
