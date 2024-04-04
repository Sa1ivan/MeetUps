import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MeetupService } from 'src/app/services/meetup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss']
})
export class CreateModalComponent implements OnInit, OnDestroy{
  private subscription: Subscription | null = null;
  createForm!: FormGroup;

  constructor(private meetUpService: MeetupService, private modal: MatDialog){}

  ngOnInit(): void {
    this.createForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required]),
      place: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      audit: new FormControl(null, [Validators.required]),
      need: new FormControl(null, [Validators.required]),
      will: new FormControl(null, [Validators.required]),
      why: new FormControl(null, [Validators.required])
    });
  }

  cancel(){
    this.modal.closeAll();
  }

  create()
  {
    this.meetUpService.createNewMeetUp(this.createForm.value).subscribe();
    this.cancel();
  }

  ngOnDestroy(): void {
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
