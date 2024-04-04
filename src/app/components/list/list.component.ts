import { OnDestroy, OnInit, Component } from '@angular/core';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
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
    this.meetUpService.getAllMeetups().subscribe(res => {
      this.meetUpService.createNew(res);
    });

    if(item != null)
    {
      return this.meetUpService.meetUpList$.subscribe((list => {
        list.forEach(info => {
          let str =  (info.name + " " + info.duration + " " + info.time + " " + info.description + " " + info.owner.fio + " " + info.will_happen + " "
                      + info.target_audience + " " + info.reason_to_come + " " + info.location + " " + info.need_to_know + " ").toLowerCase();

          if(!str.match((item).toLowerCase()))
          {
            list = list.filter(record => record.id != info.id);
          }
        })

        this.meetUpList = list;
      }))
    }
    else
    {
      return this.meetUpService.meetUpList$.subscribe((list => {
        this.meetUpList = list;
      }))
    }
  }

  ngOnDestroy(): void {
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
