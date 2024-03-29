import { NgClass } from '@angular/common';
import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit{
  state!:boolean;

  constructor(){
    this.state = true;
  }

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
    this.thenTemplate = this.isClosed;
  }
}
