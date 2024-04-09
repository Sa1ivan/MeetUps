import { AfterContentChecked, Component, EventEmitter, OnDestroy, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MeetupService } from 'src/app/services/meetup.service';
import { tap, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../../meetup/create-modal/create-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterContentChecked, OnDestroy{
  private subscription: Subscription | null = null;
  private router: Router = inject(Router);
  public authSrvs: AuthService = inject(AuthService);
  public userRole!: any;

  constructor(
    private authService: AuthService,
    private meetUpsService: MeetupService,
    private modal: MatDialog
  ) {}

  ngAfterContentChecked(): void {
    this.userRole = this.authSrvs.user?.roles[0].name + "";
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription?.unsubscribe();
  }

  @Output() getAllMeetUps = new EventEmitter();

  public logOut(){
    this.authService.logout();
  }

  public getMeetUps(){
    this.meetUpsService
      .getMeetups()
        .pipe(
          tap(item => {
            this.getAllMeetUps.emit(item);
          })
        ).subscribe();
  }

  public createNew()
  {
    this.modal.open(CreateModalComponent);
  }
}
