import { OnDestroy, OnInit, Component } from '@angular/core';
import { BehaviorSubject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})

export class UserlistComponent implements OnDestroy, OnInit{
  private subscription: Subscription | null = null;
  constructor(public userService: UserService){
  }

  ngOnInit(): void {
    this.userService.userList$ = new BehaviorSubject<User[]>([]);
    this.userService.getUsersInfo().pipe(
      takeUntil(this.userService.destroy$),
    ).subscribe(item => {
      this.userService.userList$.next(item);
      setTimeout(()=> this.userService.userList$.next(item), 40000);
    })
  }

  deleteUser(user: User)
  {
    this.userService.deleteUser(user);
  }

  editUser(user: User)
  {
    this.userService.editUser(user);
  }

  ngOnDestroy(): void {
    this.userService.destroy$.next();
    this.userService.destroy$.complete();
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
