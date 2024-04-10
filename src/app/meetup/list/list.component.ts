import { OnDestroy, OnInit, Component } from '@angular/core';
import { inject } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, delay, switchMap, takeUntil } from 'rxjs';
import { MeetUp } from 'src/app/components/interfaces/meetup';
import { MeetupService } from 'src/app/services/meetup.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy{
  private subscription: Subscription | null = null;
  private authService: AuthService = inject(AuthService);
  private destroy$ = new Subject<void>();
  private router: Router = inject(Router);
  public myView: boolean | null=null;
  private user = this.authService.user?.id;

  constructor(
    public meetUpService: MeetupService
  ) {}

  ngOnInit(): void {
    this.meetUpService.meetUpList$ = new BehaviorSubject<MeetUp[]>([]);

    if(this.router.url === "/nav/all")
    {
      this.myView = false;
      this.meetUpService.getMeetups()
      .pipe(
          takeUntil(this.destroy$),
          delay(1500)
        ).subscribe(item => {
            item = item.filter(record => record.owner !== null)
            this.meetUpService.meetUpList$.next(item);
        })
    }
    else
    {
      this.myView = true;
      this.meetUpService.getMeetups()
      .pipe(
          takeUntil(this.destroy$),
          delay(1500)
        ).subscribe(item => {
            item = item.filter(record => record.owner !== null && record.owner.id === this.user);
            this.meetUpService.meetUpList$.next(item);
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public refresh(index: number, meetUp: MeetUp)
  {
    return meetUp.id;
  }

  private refreshMeetUp()
  {
    this.meetUpService.meetUpList$ = new BehaviorSubject<MeetUp[]>([]);
    if(this.router.url === "/nav/all")
    {
      this.myView = false;
      this.meetUpService.getMeetups()
      .pipe(
          takeUntil(this.destroy$),
        ).subscribe(item => {
            item = item.filter(record => record.owner !== null)
            this.meetUpService.meetUpList$.next(item);
        })
    }
    else
    {
      this.myView = true;
      this.meetUpService.getMeetups()
      .pipe(
          takeUntil(this.destroy$),
        ).subscribe(item => {
          item = item.filter(record => record.owner !== null && record.owner.id === this.user);
          this.meetUpService.meetUpList$.next(item);
        })
    }
  }

  public subscribe(meetUp: MeetUp)
  {
    let sub = false;

    for(let key in meetUp.users){
      if(this.user === meetUp.users[key].id)
      {
        sub = true;
      }
    }

    if(sub)
    {
      this.unsubscribe(meetUp);
    }
    else
    {
      this.meetUpService
        .subscribeToMeetUp(meetUp)
        .pipe(
          takeUntil(this.destroy$),
          switchMap(() => this.meetUpService
            .getMeetups()
            .pipe(
              takeUntil(this.destroy$),
            ))
        )
        .subscribe(item => {
          if(this.router.url === "/nav/all")
          {
            item = item.filter(record => record.owner !== null)
          }
          else
          {
            item = item.filter(record => record.owner !== null && record.owner.id === this.user);
          }
          this.meetUpService.meetUpList$.next(item);
        });
    }
  }

  private unsubscribe(meetUp: MeetUp)
  {
    this.meetUpService.unsubscribeToMeetUp(meetUp).pipe(
      takeUntil(this.destroy$),
    ).subscribe(()=>{
      this.meetUpService.getMeetups()
      .pipe(
          takeUntil(this.destroy$),
        ).subscribe(item => {
          if(this.router.url === "/nav/all")
          {
            item = item.filter(record => record.owner !== null)
          }
          else
          {
            item = item.filter(record => record.owner !== null && record.owner.id === this.user);
          }
          this.meetUpService.meetUpList$.next(item);
        })
    });
  }

  public searchMeetUps(item: any)
  {
    if(item !== null)
    {
      this.meetUpService
        .getMeetups()
          .pipe(
            takeUntil(this.destroy$),
          ).subscribe(list => {
            list = list.filter(record => record.owner !== null);

            list.forEach(info => {
              let str =  (info.name +
                          info.duration +
                          info.time +
                          info.description +
                          info.owner.fio +
                          info.will_happen +
                          info.target_audience +
                          info.reason_to_come +
                          info.location +
                          info.need_to_know).toLowerCase();

              if(!str.match((item).toLowerCase()))
              {
                list = list.filter(record => record.id !== info.id);
              }
            })
            this.meetUpService.meetUpList$ = new BehaviorSubject<MeetUp[]>([]);

            setTimeout(()=> this.meetUpService.meetUpList$.next(list), 2000);
          })
    }
    else
    {
      this.refreshMeetUp();
    }
  }
}
