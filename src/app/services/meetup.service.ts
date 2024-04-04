import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, filter, map, Observable, of, Subject, takeUntil, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../interfaces/user';
import { MeetUp } from '../interfaces/meetup';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MeetupService implements OnDestroy{
  baseUrl: string = environment.apiUrl;
  meetUpList: Array<MeetUp> = [];
  meetUpList$ = new BehaviorSubject<MeetUp[]>([]);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  public getAllMeetups() {
    return this.http.get(`${this.baseUrl}/meetup`)
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

  public getMeetups() {
    const user = this.authService.user?.id;
    return this.http.get(`${this.baseUrl}/meetup`)
    .pipe(
      takeUntil(this.destroy$),
      catchError((e): Observable<null> => {
        console.log(e.error.message);
        return of(null);
      })
    );
  }

  public createNew(item: any){
    this.meetUpList = this.meetUpList$.getValue();
    this.meetUpList$.next(item);
  }

  public subscribeToMeetUp(meetUp: MeetUp)
  {
    const user = this.authService.user?.id;
    return this.http.put(`${this.baseUrl}/meetup`, {idMeetup: meetUp.id, idUser: user})
    .pipe(
      tap((res) => {
        if(window.location.href.indexOf("all") > 0){
          this.getAllMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
        else{
          this.getMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
      }),
      takeUntil(this.destroy$),
      catchError((): Observable<null> => {
        return of(null);
      })
    );
  }


  public unsubscribeToMeetUp(meetUp: MeetUp)
  {
    const user = this.authService.user?.id;

    return this.http.delete(`${this.baseUrl}/meetup`, {body: {idMeetup: meetUp.id, idUser: user}})
    .pipe(
      tap((res) => {
        if(window.location.href.indexOf("all") > 0){
          this.getAllMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
        else{
          this.getMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
      }),
      takeUntil(this.destroy$),
      catchError((): Observable<null> => {
        return of(null);
      })
    ).subscribe();
  }

  updateMeetUp(meetUp: {id: number, name: string, time: string, description: string, place: string, audit: string, need: string, will: string, why: string})
  {
    const id = meetUp.id;
    return this.http.put(`${this.baseUrl}/meetup/${id}`,
    {
      name: meetUp.name, description: meetUp.description, time: meetUp.time, duration: 90, location: meetUp.place,
      target_audience: meetUp.audit, need_to_know: meetUp.need, will_happen: meetUp.will, reason_to_come: meetUp.why
    },
    this.httpOptions)
    .pipe(
      tap((res) => {
        if(window.location.href.indexOf("all") > 0){
          this.getAllMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
        else{
          this.getMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
      }),
      takeUntil(this.destroy$),
      catchError((): Observable<null> => {
        return of(null);
      })
    );
  }

  createNewMeetUp(meetUp: { name: string, time: string, description: string, place: string, audit: string, need: string, will: string, why: string})
  {
    console.log(meetUp);
    
    return this.http.post(`${this.baseUrl}/meetup`,
    {
      name: meetUp.name, description: meetUp.description, time: meetUp.time, duration: 90, location: meetUp.place,
      target_audience: meetUp.audit, need_to_know: meetUp.need, will_happen: meetUp.will, reason_to_come: meetUp.why
    }, this.httpOptions)
    .pipe(
      tap(() => {
        this.getAllMeetups().subscribe(item=>{
          console.log(item);
          this.createNew(item);
        })
      }),
      takeUntil(this.destroy$),
      catchError((): Observable<null> => {
        return of(null);
      })
    );
  }

  deleteMeetUp(meetUp: string)
  {
    return this.http.delete(`${this.baseUrl}/meetup/${meetUp}`)
    .pipe(
      tap((res) => {
        if(window.location.href.indexOf("all") > 0){
          this.getAllMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
        else{
          this.getMeetups().subscribe(item=>{
            this.createNew(item);
          })
        }
      }),
      takeUntil(this.destroy$),
      catchError((): Observable<null> => {
        return of(null);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
