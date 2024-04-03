import { Component, EventEmitter, OnInit, Output, createComponent, inject } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MeetupService } from 'src/app/services/meetup.service';
import { MeetUp } from 'src/app/interfaces/meetup';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../create-modal/create-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  private router: Router = inject(Router);
  userRole!: any;
  constructor(private authService: AuthService, private meetUpsService: MeetupService, private modal: MatDialog) {
  }

  ngOnInit(): void {
    this.userRole = this.authService.user?.roles[0].name;
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

  createNew()
  {
    this.modal.open(CreateModalComponent);
  }
}
