;
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './components/list/list.component';
import { RecordComponent } from './components/record/record.component';
import { SearchComponent } from './components/search/search.component';
import { AuthComponent } from './components/auth/auth.component';
import { LogupComponent } from './components/logup/logup.component';
import { UsersComponent } from './components/users/users.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './interseptors/JwtInterceptor';
import { UserlistComponent } from './components/userlist/userlist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { CreateModalComponent } from './components/create-modal/create-modal.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListComponent,
    RecordComponent,
    SearchComponent,
    AuthComponent,
    LogupComponent,
    UsersComponent,
    UserlistComponent,
    EditModalComponent,
    CreateModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
