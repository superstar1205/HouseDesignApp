import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() public isDisabled = false;
  @Input() public lazySearch = false;
  @Input() public placeHolder = 'Search';
  @Input() public searchTxt = '';
  @Output() onSearchTrigger = new EventEmitter<any>();
  searchEnabled = false;
  constructor(private helper: HelperService) { }
  onSearch() {
    if (this.searchTxt !== '' && this.searchTxt.toString().trim()) {
      this.searchEnabled = true;
      this.helper.onScrollCloseKeyBoard();
      this.onSearchTrigger.emit({searchText: this.searchTxt});
    }
  }
  onChangeSearch() {
    if (this.lazySearch) {
      if (this.searchTxt === '' && this.searchEnabled) {
        this.onSearchTrigger.emit({searchText: this.searchTxt});
      }
    } else {
      this.onSearchTrigger.emit({searchText: this.searchTxt});
    }
  }
}
