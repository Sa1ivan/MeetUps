import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logup',
  templateUrl: './logup.component.html',
  styleUrls: ['./logup.component.scss']
})
export class LogupComponent {
  public logupForm: FormGroup;
  private router: Router = inject(Router);

  constructor(private authService: AuthService){
    this.logupForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required]),
        fullname: new FormControl(null, [Validators.required])
    })
  }

  public authSubmit()
  {
    if(this.logupForm.valid)
    {
      this.authService.signup(this.logupForm.value);
      this.logupForm.reset();
    }
  }

  public logIn(){
    this.router.navigate(['']);
  }
}
