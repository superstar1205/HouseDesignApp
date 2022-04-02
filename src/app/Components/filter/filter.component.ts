import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Output() onFilterTrigger = new EventEmitter<any>();
  @Input() public isDisabled;
  @Input() public cFilterByStatus;
  @Input() public filterOptArr;
  constructor(private helper: HelperService) { }
  async onFilter() {
    this.helper.onFilter(this.filterOptArr, this.cFilterByStatus).then((res) => {
      console.log('res', res);
      this.cFilterByStatus = res;
      this.onFilterTrigger.emit({ cCurrentFilter: this.cFilterByStatus });
    }).catch(() => {});
  }
}
