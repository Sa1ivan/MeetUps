import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MeetupService } from 'src/app/services/meetup.service';
import { MeetUp } from 'src/app/interfaces/meetup';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private router: Router = inject(Router);
  constructor(private authService: AuthService, private meetUpsService: MeetupService) {
  }

  logOut(){
    this.authService.logout();
  }
  @Output() getAllMeetUps = new EventEmitter();

  getMeetUps(){
    this.meetUpsService.getMeetups().pipe(
      tap(item => {
        this.getAllMeetUps.emit(item);
      })
    ).subscribe();
  }
}
