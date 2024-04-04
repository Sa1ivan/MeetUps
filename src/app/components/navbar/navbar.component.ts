import { AfterContentChecked, AfterContentInit, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MeetupService } from 'src/app/services/meetup.service';
import { tap, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../create-modal/create-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterContentChecked, OnDestroy{
  private subscription: Subscription | null = null;
  private router: Router = inject(Router);
  public authSrvs: AuthService = inject(AuthService);
  userRole!: any;

  constructor(private authService: AuthService, private meetUpsService: MeetupService, private modal: MatDialog) {}

  ngAfterContentChecked(): void {
    this.userRole = this.authSrvs.user?.roles[0].name + "";
  }

  @Output() getAllMeetUps = new EventEmitter();

  logOut(){
    this.authService.logout();
  }

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

  ngOnDestroy(): void {
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
