import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, Subject, takeUntil, tap, of } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../interfaces/user';
import { MeetUp } from '../interfaces/meetup';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{
  baseUrl: string = environment.apiUrl;
  userList: Array<User> = [];
  userList$ = new BehaviorSubject<User[]>([]);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  public RefreshItems(item: any)
  {
    this.userList = this.userList$.getValue();
    this.userList$.next(item);
  }

  public getUsersInfo()
  {
    return this.http.get(`${this.baseUrl}/user`)
    .pipe(
      tap((res) => {
        if (res) {
        }
        return null;
      }),
      takeUntil(this.destroy$),
      catchError((e): Observable<null> => {
        console.log(e.error.message);
        return of(null);
      })
    );
  }

  public editUser(userData: User)
  {
    const userId = userData.id;

    return this.http.put(`${this.baseUrl}/user/${userId}`, {email: userData.email, password: userData.password, fio: userData.fio})
    .pipe(
      tap((res) => {
        if (res) {
          this.getUsersInfo().subscribe(item => {
            this.RefreshItems(item);
          })
        }
        return null;
      }),
      takeUntil(this.destroy$),
      catchError((e): Observable<null> => {
        console.log(e.error.message);
        return of(null);
      })
    ).subscribe();
  }

  public deleteUser(userData: User)
  {
    const userId = userData.id;

    return this.http.delete(`${this.baseUrl}/user/${userId}`)
    .pipe(
      tap((res) => {
        if (res) {
          this.getUsersInfo().subscribe(item => {
            this.RefreshItems(item);
          })
        }
        return null;
      }),
      takeUntil(this.destroy$),
      catchError((e): Observable<null> => {
        console.log(e.error.message);
        return of(null);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
