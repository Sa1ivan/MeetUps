import { Injectable, OnDestroy, OnInit, Component, Input, EventEmitter, Output} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, filter, map, Observable, of, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { MeetUp } from 'src/app/interfaces/meetup';
import { MeetupService } from 'src/app/services/meetup.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UserlistComponent } from '../userlist/userlist.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  private subscription: Subscription | null = null;
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
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
