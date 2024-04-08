import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
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

  public getMeetups() {
    return this.http.get<MeetUp[]>(`${this.baseUrl}/meetup`);
  }

  public subscribeToMeetUp(meetUp: MeetUp)
  {
    const user = this.authService.user?.id;
    return this.http.put(`${this.baseUrl}/meetup`, {idMeetup: meetUp.id, idUser: user});
  }

  public unsubscribeToMeetUp(meetUp: MeetUp)
  {
    const user = this.authService.user?.id;
    return this.http.delete(`${this.baseUrl}/meetup`, {body: {idMeetup: meetUp.id, idUser: user}});
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
      tap(() => {
          this.getMeetups().subscribe(item=>{
            if(window.location.href.indexOf("all") > 0)
            {
              item = item.filter(record => record.owner !== null)
            }
            else
            {
              item = item.filter(record => record.owner !== null && record.owner.id == this.authService.user?.id);
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

  createNewMeetUp(meetUp: { name: string, time: string, description: string, place: string, audit: string, need: string, will: string, why: string})
  {
    return this.http.post(`${this.baseUrl}/meetup`,
    {
      name: meetUp.name, description: meetUp.description, time: meetUp.time, duration: 90, location: meetUp.place,
      target_audience: meetUp.audit, need_to_know: meetUp.need, will_happen: meetUp.will, reason_to_come: meetUp.why
    }, this.httpOptions)
    .pipe(
      tap(() => {
          this.getMeetups().subscribe(item=>{
          if(window.location.href.indexOf("all") > 0)
          {
            item = item.filter(record => record.owner !== null)
          }
          else
          {
            item = item.filter(record => record.owner !== null && record.owner.id == this.authService.user?.id);
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

  deleteMeetUp(meetUp: string)
  {
    return this.http.delete(`${this.baseUrl}/meetup/${meetUp}`)
    .pipe(
      tap((res) => {
        this.getMeetups().subscribe(item=>{
          if(window.location.href.indexOf("all") > 0)
          {
            item = item.filter(record => record.owner !== null)
          }
          else
          {
            item = item.filter(record => record.owner !== null && record.owner.id == this.authService.user?.id);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
