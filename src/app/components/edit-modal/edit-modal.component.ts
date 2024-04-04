import { Component, EventEmitter, Output, Input, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MeetUp } from 'src/app/interfaces/meetup';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MeetupService } from 'src/app/services/meetup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy{
  editMeetUp!: FormGroup;
  private subscription: Subscription | null = null;

  constructor(private modal: MatDialog, private meetUpService: MeetupService, @Inject(MAT_DIALOG_DATA) public data: any){

  }

  inutData: any;

  ngOnInit(): void {
    this.inutData = this.data;
    this.editMeetUp = new FormGroup({
      name: new FormControl(this.inutData.name),
      time: new FormControl(this.inutData.time),
      place: new FormControl(this.inutData.place),
      description: new FormControl(this.inutData.description),
      audit: new FormControl(this.inutData.audit),
      need: new FormControl(this.inutData.need),
      will: new FormControl(this.inutData.will),
      why: new FormControl(this.inutData.why),
      id: new FormControl(this.inutData.id)
    })
  }

  deleteRecord()
  {
    this.meetUpService.deleteMeetUp(this.editMeetUp.value.id);
    this.modal.closeAll();
  }

  save()
  {
    this.meetUpService.updateMeetUp(this.editMeetUp.value).subscribe();
    this.modal.closeAll();
  }

  undo()
  {
    this.modal.closeAll();
  }

  ngOnDestroy(): void {
    while(this.subscription) this.subscription?.unsubscribe();
  }
}
