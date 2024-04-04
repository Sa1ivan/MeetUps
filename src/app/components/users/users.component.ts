import { Component, Input, EventEmitter, Output, inject} from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  private authService: AuthService = inject(AuthService);
  userList!: User[];
  constructor(public userService: UserService){
    this.userList = this.userService.userList;
  }

  @Input() sUser!: User;
  @Output() delete = new EventEmitter<User>();
  @Output() edit = new EventEmitter<User>();


  deleteUser()
  {
    this.delete.emit(this.sUser);
  }

  editUser()
  {
    this.edit.emit(this.sUser);
  }
}
