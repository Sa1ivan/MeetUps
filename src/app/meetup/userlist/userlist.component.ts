import { OnDestroy, OnInit, Component } from '@angular/core';
import { BehaviorSubject, Subscription, takeUntil, Subject, delay } from 'rxjs';
import { User } from 'src/app/components/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})

export class UserlistComponent implements OnDestroy, OnInit{
  private subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  private userId = this.authService.user?.id;

  constructor(
    public userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.userList$ = new BehaviorSubject<User[]>([]);

    this.userService
      .getUsersInfo()
      .pipe(
        takeUntil(this.destroy$),
        delay(1500)
      ).subscribe(item => {
        this.userService.userList$.next(item);
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public refresh(index: number, user: User)
  {
    return user.id;
  }

  public deleteUser(user: User)
  {
    this.userService.deleteUser(user);

    if(this.userId === user.id)
    {
      this.authService.logout();
    }
  }

  public editUser(user: User)
  {
    this.userService.editUser(user);

    if(this.userId === user.id)
    {
      this.authService.logout();
    }
  }
}
