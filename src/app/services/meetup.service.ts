import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MeetUp } from '../components/interfaces/meetup';
import { AuthService } from './auth.service';

@Injectable()

export class MeetupService implements OnDestroy{
  private baseUrl: string = environment.apiUrl;
  public meetUpList$ = new BehaviorSubject<MeetUp[]>([]);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  private user = this.authService.user?.id;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getMeetups() {
    return this.http.get<MeetUp[]>(`${this.baseUrl}/meetup`);
  }

  public subscribeToMeetUp(meetUp: MeetUp)
  {
    return this.http.put(`${this.baseUrl}/meetup`, {idMeetup: meetUp.id, idUser: this.user});
  }

  public unsubscribeToMeetUp(meetUp: MeetUp)
  {
    return this.http.delete(`${this.baseUrl}/meetup`, {body: {idMeetup: meetUp.id, idUser: this.user}});
  }

  public updateMeetUp(meetUp: {id: number, name: string, time: string, description: string, place: string, audit: string, need: string, will: string, why: string})
  {
    const id = meetUp.id;

    return this.http.put(`${this.baseUrl}/meetup/${id}`,
    {
      name: meetUp.name, description: meetUp.description, time: meetUp.time, duration: 90, location: meetUp.place,
      target_audience: meetUp.audit, need_to_know: meetUp.need, will_happen: meetUp.will, reason_to_come: meetUp.why
    },
    this.httpOptions)
    .pipe(
      tap(() => {
        this.getMeetups()
          .subscribe(item=>{
            if(this.router.url === "/nav/all")
            {
              item = item.filter(record => record.owner !== null)
            }
            else
            {
              item = item.filter(record => record.owner !== null && record.owner.id === this.user);
            }

            this.meetUpList$.next(item);
          })
      }),
      takeUntil(this.destroy$),
      catchError((): Observable<null> => {
        return of(null);
      })
    );
  }

  public createNewMeetUp(meetUp: { name: string, time: string, description: string, place: string, audit: string, need: string, will: string, why: string})
  {
    return this.http
    .post(`${this.baseUrl}/meetup`,
      {
        name: meetUp.name, description: meetUp.description, time: meetUp.time, duration: 90, location: meetUp.place,
        target_audience: meetUp.audit, need_to_know: meetUp.need, will_happen: meetUp.will, reason_to_come: meetUp.why
      }, this.httpOptions)
      .pipe(
        tap(() => {
          this.getMeetups()
            .subscribe(item=>{
              if(this.router.url === "/nav/all")
              {
                item = item.filter(record => record.owner !== null)
              }
              else
              {
                item = item.filter(record => record.owner !== null && record.owner.id === this.user);
              }
              this.meetUpList$.next(item);
            })
        }),
        takeUntil(this.destroy$),
        catchError((): Observable<null> => {
          return of(null);
        })
      );
  }

  public deleteMeetUp(meetUp: string)
  {
    return this.http
    .delete(`${this.baseUrl}/meetup/${meetUp}`)
      .pipe(
        tap(() => {
          this.getMeetups()
            .subscribe(item=>{
              if(this.router.url === "/nav/all")
              {
                item = item.filter(record => record.owner !== null)
              }
              else
              {
                item = item.filter(record => record.owner !== null && record.owner.id === this.user);
              }
              this.meetUpList$.next(item);
            })
        }),
        takeUntil(this.destroy$),
        catchError((): Observable<null> => {
          return of(null);
        })
      ).subscribe();
  }
}
