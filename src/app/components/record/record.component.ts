import { Component, ViewChild, TemplateRef, OnInit, Input, inject, Output, EventEmitter, AfterContentChecked } from '@angular/core';
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
  buttonState!: boolean;
  public authSerivce: AuthService = inject(AuthService);
  user = this.authSerivce.user?.id;
  isCorrect!: number;
  buttonEdit = true;


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
    for(let id in this.sMeetUp.users)
    {
      if(this.isCorrect != 1)
      {
        if(this.sMeetUp.users[id].id == this.user)
        {
          this.buttonState = true;
          this.isCorrect = 1;
        }
        else
        {
          this.buttonState = false;
        }
      }
    }
    if(this.sMeetUp.owner.id != this.user)
    {
      this.buttonEdit = false;
    }
  }


  sub(){
    this.subscribe.emit(this.sMeetUp);
  }

  openModal()
  {
    this.modal.open(EditModalComponent, {
      data: {
        name: this.sMeetUp.name,
        date: this.sMeetUp.time,
        time: this.sMeetUp.time,
        place: this.sMeetUp.location,
        description: this.sMeetUp.description,
        audit: this.sMeetUp.target_audience,
        need: this.sMeetUp.need_to_know,
        will: this.sMeetUp.will_happen,
        why: this.sMeetUp.reason_to_come,
        id: this.sMeetUp.id,
        owner: this.sMeetUp.owner.id
      }
    });
  }
}
