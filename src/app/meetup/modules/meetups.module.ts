import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from '../list/list.component';
import { RecordComponent } from '../record/record.component';
import { SearchComponent } from '../search/search.component';
import { UsersComponent } from '../users/users.component';
import { HttpClientModule } from '@angular/common/http';
import { UserlistComponent } from '../userlist/userlist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { CreateModalComponent } from '../create-modal/create-modal.component';
import { MeetupService } from 'src/app/services/meetup.service';
import { UserService } from 'src/app/services/user.service';



@NgModule({
  declarations: [
    ListComponent,
    RecordComponent,
    SearchComponent,
    UsersComponent,
    UserlistComponent,
    EditModalComponent,
    CreateModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [
    MeetupService,
    UserService
  ],
  exports: [
    ListComponent,
    RecordComponent,
    SearchComponent,
    UsersComponent,
    UserlistComponent,
    EditModalComponent,
    CreateModalComponent,
  ]
})
export class MeetupsModule { }
