import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  authForm: FormGroup;
  router: Router = inject(Router);

  constructor(){
    this.authForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required])
    })
  }

  authSubmit()
  {
    if(this.authForm.valid)
    {
      this.authForm.reset();
      this.router.navigate(['nav/all']);
    }
  }

  logUp(){
    this.router.navigate(['nav/logup']);
  }
}
