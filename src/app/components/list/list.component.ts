import { OnDestroy, OnInit, Component, AfterContentChecked } from '@angular/core';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, interval, of, takeUntil } from 'rxjs';
import { MeetUp } from 'src/app/interfaces/meetup';
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
  private router: Router = inject(Router);
  myView: boolean | null=null;
  meetUpList: Array<MeetUp> = [];

  constructor(public meetUpService: MeetupService){
    this.meetUpList = this.meetUpService.meetUpList;
  }

  ngOnInit(): void {
    this.meetUpService.meetUpList$ = new BehaviorSubject<MeetUp[]>([]);
    if(window.location.href.indexOf("all") > 0)
    {
      this.myView = false;
      this.meetUpService.getMeetups().pipe(
        takeUntil(this.meetUpService.destroy$),
      ).subscribe(item => {
        setTimeout(()=> this.meetUpService.meetUpList$.next(item), 1500);
      })
    }
    else
    {
      this.myView = true;
      this.meetUpService.getMeetups().pipe(
        takeUntil(this.meetUpService.destroy$),
      ).subscribe(item => {
        item = item.filter(record => record.owner.id == this.authService.user?.id)
        setTimeout(()=> this.meetUpService.meetUpList$.next(item), 1500);
        if(this.meetUpService.meetUpList$.getValue().length == 0)
        {
          alert("Записей нет!");
          this.router.navigate(['nav/all']);
        }
      })
    }
  }

  refreshMeetUp()
  {
    this.meetUpService.meetUpList$ = new BehaviorSubject<MeetUp[]>([]);
    if(window.location.href.indexOf("all") > 0)
    {
      this.myView = false;
      this.meetUpService.getMeetups().pipe(
        takeUntil(this.meetUpService.destroy$),
      ).subscribe(item => {
        this.meetUpService.meetUpList$.next(item);
      })
    }
    else
    {
      this.myView = true;
      this.meetUpService.getMeetups().pipe(
        takeUntil(this.meetUpService.destroy$),
      ).subscribe(item => {
        item = item.filter(record => record.owner.id == this.authService.user?.id)
        this.meetUpService.meetUpList$.next(item);
      })
    }
  }

  timer = setInterval(() => this.refreshMeetUp(), 360000);

  subscribe(meetUp: MeetUp)
  {
    let sub = false;

    for(let key in meetUp.users){
      if(this.authService.user?.id == meetUp.users[key].id)
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
      this.meetUpService.subscribeToMeetUp(meetUp).pipe(
        takeUntil(this.meetUpService.destroy$),
      ).subscribe(()=>{
        this.meetUpService.getMeetups().pipe(
          takeUntil(this.meetUpService.destroy$),
        ).subscribe(item => {
          this.meetUpService.meetUpList$.next(item);
        })
      });
    }
  }

  unsubscribe(meetUp: MeetUp)
  {
    this.meetUpService.unsubscribeToMeetUp(meetUp).pipe(
      takeUntil(this.meetUpService.destroy$),
    ).subscribe(()=>{
      this.meetUpService.getMeetups().pipe(
        takeUntil(this.meetUpService.destroy$),
      ).subscribe(item => {
        this.meetUpService.meetUpList$.next(item);
      })
    });
  }

  searchMeetUps(item: any)
  {
    if(item != null)
    {
        this.meetUpService.getMeetups().pipe(
          takeUntil(this.meetUpService.destroy$),
        ).subscribe(list => {
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
            list = list.filter(record => record.id != info.id);
          }
        })
        this.meetUpService.meetUpList$ = new BehaviorSubject<MeetUp[]>([]);
        setTimeout(()=> this.meetUpService.meetUpList$.next(list), 2000);
      })
    }
    else{
      this.refreshMeetUp();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.meetUpService.destroy$.next();
    this.meetUpService.destroy$.complete();
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
