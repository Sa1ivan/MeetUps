import { Component, inject } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private router: Router = inject(Router);
  constructor() {

  }
  logOut(){
    this.router.navigate(['']);
  }
}
