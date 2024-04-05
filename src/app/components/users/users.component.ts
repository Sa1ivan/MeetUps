import { Component, Input, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  constructor(public userService: UserService){
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
