import { Component, ViewChild, TemplateRef, OnInit, Input, inject, Output, EventEmitter } from '@angular/core';
import { MeetUp } from '../../components/interfaces/meetup';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit{
  public state!:boolean;
  public buttonState!: boolean;
  public authSerivce: AuthService = inject(AuthService);
  private user = this.authSerivce.user?.id;
  public isCorrect!: number;
  public buttonEdit = true;
  public thenTemplate: TemplateRef<any>|null=null;

  @ViewChild('isOpen')
  public isOpen:TemplateRef<any>|null=null;

  @ViewChild('isClosed')
  public isClosed:TemplateRef<any>|null=null;

  @Output() subscribe = new EventEmitter<MeetUp>();
  @Output() editRecord = new EventEmitter<MeetUp>();

  @Input() sMeetUp!: MeetUp;
  public date = "";
  public time = "";

  constructor(private modal: MatDialog)
  {
    this.state = true;
  }

  ngOnInit(): void {
    for(let id in this.sMeetUp.users)
    {
      if(this.isCorrect != 1)
      {
        if(this.sMeetUp.users[id].id === this.user)
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
    if(this.sMeetUp.owner.id !== this.user)
    {
      this.buttonEdit = false;
    }
    this.date = (this.sMeetUp.time + "").split('T')[0] + " / " + (this.sMeetUp.time + "").split('T')[1].split('.')[0];
  }

  public switchThenTemplate()
  {
    this.thenTemplate=
     (this.thenTemplate===this.isClosed) ?
      this.isOpen:
      this.isClosed;
  }

  public sub()
  {
    this.buttonState = !this.buttonState;
    this.subscribe.emit(this.sMeetUp);
  }

  public openModal()
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
