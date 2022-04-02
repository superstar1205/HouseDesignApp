import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';
import {ModalService} from '../../Services/modal/modal.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Output() protected onChangeTrig = new EventEmitter<any>();
  @Input() public label = '';
  @Input() public myValue = null;
  @Input() public placeholder = '';
  @Input() public sType = '';
  @Input() public mySelectedVal = null;
  @Input() public touchFormKey = null;
  constructor(private modalService: ModalService) { }
  ngOnInit() {}
  onChangeSelect() {
    if (this.sType === '_HEAD_CLIENT') {
      this.modalService.openModal('_HEAD_CLIENT', 'Select Client', {currentSelected: this.mySelectedVal}, '', 'Selectable', this.touchFormKey).then((res: any) => {
        this.onChangeTrig.emit(res);
      }).catch(() => {});
    }
  }
}
