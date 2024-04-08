import { OnDestroy, OnInit, Component } from '@angular/core';
import { BehaviorSubject, Subscription, takeUntil, Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
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
  constructor(public userService: UserService, private authService: AuthService){
  }

  ngOnInit(): void {
    this.userService.userList$ = new BehaviorSubject<User[]>([]);
    this.userService.getUsersInfo().pipe(
      takeUntil(this.destroy$),
    ).subscribe(item => {
      this.userService.userList$.next(item);
      setTimeout(()=> this.userService.userList$.next(item), 40000);
    })
  }

  deleteUser(user: User)
  {
    const userId = this.authService.user?.id;
    this.userService.deleteUser(user);

    if(userId == user.id)
    {
      this.authService.logout();
    }
  }

  editUser(user: User)
  {
    const userId = this.authService.user?.id;
    this.userService.editUser(user);

    if(userId == user.id)
    {
      this.authService.logout();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
