import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  authForm: FormGroup;
  router: Router = inject(Router);

  constructor(public authService: AuthService){
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }

  authSubmit()
  {
    if(this.authForm.valid)
    {
      this.authService.logIn(this.authForm.value);
      this.authForm.reset();
    }
  }

  logUp(){
    this.router.navigate(['nav/logup']);
  }
}
