import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MeetupService } from 'src/app/services/meetup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy{
  public editMeetUp!: FormGroup;
  private subscription: Subscription | null = null;
  public inutData: any;

  constructor(
    private modal: MatDialog,
    private meetUpService: MeetupService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    this.inutData = this.data;
    this.editMeetUp = new FormGroup({
      name: new FormControl(this.inutData.name),
      time: new FormControl(this.inutData.time.split('T')[1].split('.')[0]),
      date: new FormControl(this.inutData.date.split('T')[0]),
      place: new FormControl(this.inutData.place),
      description: new FormControl(this.inutData.description),
      audit: new FormControl(this.inutData.audit),
      need: new FormControl(this.inutData.need),
      will: new FormControl(this.inutData.will),
      why: new FormControl(this.inutData.why),
      id: new FormControl(this.inutData.id)
    });
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription?.unsubscribe();
  }

  public deleteRecord()
  {
    this.meetUpService
      .deleteMeetUp(this.editMeetUp.value.id);

    this.modal.closeAll();
  }

  public save()
  {
    this.editMeetUp.value.time = this.editMeetUp.value.date + "T" + this.editMeetUp.value.time + ":00.000Z";

    this.meetUpService
      .updateMeetUp(this.editMeetUp.value)
        .subscribe();

    this.modal.closeAll();
  }

  public undo()
  {
    this.modal.closeAll();
  }
}
