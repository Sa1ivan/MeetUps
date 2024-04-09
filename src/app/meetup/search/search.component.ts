import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  public searchForm: FormGroup;

  constructor(){
    this.searchForm = new FormGroup({
      searchInput: new FormControl(null)
    });
  }

  @Output() search = new EventEmitter<any>();

  public searchMeetUps()
  {
    this.search.emit(this.searchForm.value.searchInput);
    this.searchForm.reset();
  }
}
