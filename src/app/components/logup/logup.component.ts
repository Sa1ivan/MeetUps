import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logup',
  templateUrl: './logup.component.html',
  styleUrls: ['./logup.component.scss']
})
export class LogupComponent {
  logupForm: FormGroup;
  router: Router = inject(Router);

  constructor(){
    this.logupForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required]),
        fullname: new FormControl(null, [Validators.required])
    })
  }

  authSubmit()
  {
    if(this.logupForm.valid)
    {
      this.logupForm.reset();
      this.router.navigate(['']);
    }
  }

  logIn(){
    this.router.navigate(['']);
  }
}
