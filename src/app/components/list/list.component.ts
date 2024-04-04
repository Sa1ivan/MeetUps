import { Injectable, OnDestroy, OnInit, Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, filter, map, Observable, of, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { MeetUp } from 'src/app/interfaces/meetup';
import { MeetupService } from 'src/app/services/meetup.service';
import { AuthService } from 'src/app/services/auth.service';

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

    if(window.location.href.indexOf("all") > 0)
    {
      this.myView = false;
      this.meetUpService.getAllMeetups().subscribe(item => {
        this.meetUpService.createNew(item);
      });

      this.meetUpService.meetUpList$.subscribe((list => {
        this.meetUpList = list;
      }))
    }
    else
    {
      this.myView = true;
      this.meetUpService.getMeetups().subscribe(item => {
        this.meetUpService.createNew(item);
      });

      this.meetUpService.meetUpList$.subscribe((list => {
        list = list.filter(record => record.owner.id == this.authService.user?.id)
        this.meetUpList = list;
      }))
    }
  }

  _subscribe(meetUp: MeetUp){
    let sub = false;

    for(let key in meetUp.users){
      if(this.authService.user?.id == meetUp.users[key].id)
      {
        sub = true;
      }
    }

    if(sub == true)
    {
      this._unsubscribe(meetUp);
    }
    else
    {
      this.meetUpService.subscribeToMeetUp(meetUp).subscribe();
    }
  }

  _unsubscribe(meetUp: MeetUp)
  {
    this.meetUpService.unsubscribeToMeetUp(meetUp);
  }

  searchMeetUps(item: any)
  {
    this.meetUpService.getAllMeetups().subscribe(item => {
      this.meetUpService.createNew(item);
    });

    this.meetUpService.meetUpList$.subscribe((list => {
      list = list.filter(record => {
        console.log(item);

        record.name == item;
        /*||
        record.time + "" == item ||
        record.description == item ||
        record.duration + "" == item ||
        record.owner + "" == item ||
        record.will_happen == item ||
        record.target_audience == item ||
        record.reason_to_come == item ||
        record.need_to_know == item ||
        record.location == item */
      })
      console.log(list);
      
      this.meetUpList = list;
    }))
  }

  ngOnDestroy(): void {
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
