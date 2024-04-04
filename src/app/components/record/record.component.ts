import { Component, ViewChild, TemplateRef, OnInit, Input, inject, Output, EventEmitter } from '@angular/core';
import { MeetUp } from 'src/app/interfaces/meetup';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit{
  state!:boolean;
  buttonName!: string;
  buttonStatus!: string;
  public authSerivce: AuthService = inject(AuthService);


  constructor(private modal: MatDialog){
    this.state = true;
  }
  @Output() subscribe = new EventEmitter<MeetUp>();
  @Output() editRecord = new EventEmitter<MeetUp>();

  @Input() sMeetUp!: MeetUp;

  thenTemplate: TemplateRef<any>|null=null;

  @ViewChild('isOpen')
  isOpen:TemplateRef<any>|null=null;

  @ViewChild('isClosed')
  isClosed:TemplateRef<any>|null=null;

  switchThenTemplate() {
    this.thenTemplate=
     (this.thenTemplate===this.isClosed) ?
     this.isOpen:
     this.isClosed;
  }

  ngOnInit(): void {
    const user = this.authSerivce.user?.id;
    for(let key in this.sMeetUp){
      if(this.sMeetUp.users.length < 2)
      {
        this.buttonName = "Я пойду!";
        this.buttonStatus = "record__sub-green"
      }
      for(let id in this.sMeetUp.users)
      {
        if(this.sMeetUp.users[id].id == user)
        {
          this.buttonName = "Не смогу пойти";
          this.buttonStatus = "record__sub-grey";
        }
        else if(this.sMeetUp.users[id].id < 2){
          this.buttonName = "Я пойду!";
          this.buttonStatus = "record__sub-green"
        }
        else{
          this.buttonName = "Я пойду!";
          this.buttonStatus = "record__sub-green"
        }
      }
    }
    this.thenTemplate = this.isClosed;
  }

  sub(){
    this.subscribe.emit(this.sMeetUp);
    if(this.buttonName == "Я пойду!"){
      this.buttonName = "Не смогу пойти";
      this.buttonStatus = "record__sub-grey";
    }
    else{
      this.buttonName = "Я пойду!";
      this.buttonStatus = "record__sub-green"
    }
  }

  openModal()
  {
    this.modal.open(EditModalComponent, {
      data: {
        name: this.sMeetUp.name,
        time: this.sMeetUp.time,
        place: this.sMeetUp.location,
        description: this.sMeetUp.description,
        audit: this.sMeetUp.target_audience,
        need: this.sMeetUp.need_to_know,
        will: this.sMeetUp.will_happen,
        why: this.sMeetUp.reason_to_come,
        id: this.sMeetUp.id
      }
    });
  }
}
