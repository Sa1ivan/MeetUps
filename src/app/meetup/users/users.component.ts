import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { User } from 'src/app/components/interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  public userRole = "";

  constructor(){}

  @Input() sUser!: User;
  @Output() delete = new EventEmitter<User>();
  @Output() edit = new EventEmitter<User>();

  ngOnInit(): void {
    this.sUser.roles.forEach(role => {
      this.userRole = this.userRole + role.name + "\n";
    })
  }

  public deleteUser()
  {
    this.delete.emit(this.sUser);
  }

  public editUser()
  {
    this.edit.emit(this.sUser);
  }
}
