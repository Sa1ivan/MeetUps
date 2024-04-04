import { OnDestroy, OnInit, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})

export class UserlistComponent implements OnDestroy, OnInit{
  private subscription: Subscription | null = null;
  userList!: User[];
  constructor(public userService: UserService){
    this.userList = this.userService.userList;
  }

  ngOnInit(): void {
    this.userService.getUsersInfo().subscribe(item => {
      this.userService.RefreshItems(item);
    })
    this.userService.userList$.subscribe((list => {
      this.userList = list;
    }))
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
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
