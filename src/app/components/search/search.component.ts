import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs';
import { MeetupService } from 'src/app/services/meetup.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchForm: FormGroup;
  private meetService: MeetupService = inject(MeetupService);

  constructor(){
    this.searchForm = new FormGroup({
      searchInput: new FormControl(null)
    });
  }

  @Output() search = new EventEmitter<any>();

  searchMeetUps()
  {
    this.search.emit(this.searchForm.value.searchInput);
    this.searchForm.reset();
  }
}
