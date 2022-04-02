import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';

@Component({
  selector: 'app-tab-payment-list',
  templateUrl: './tab-payment-list.component.html',
  styleUrls: ['./tab-payment-list.component.scss'],
})
export class TabPaymentListComponent implements OnInit {
  @Output() btnTrigger = new EventEmitter<any>();
  @Input() public loading;
  @Input() public list = [];
  constructor(public helper: HelperService) { }

  ngOnInit() {}
  onBtnTrigger(btn: any, data = null) {
    this.btnTrigger.emit({returnType: btn, data});
  }

}
