import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ApiService} from '../../Services/api/api.service';
import {AuthService} from '../../core/auth/auth.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {APP_PAGES, PURPOSE} from '../../app-constants.service';
import _ from 'lodash';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent {
  _: any = _;
  @Output() onPushPageTrigger = new EventEmitter<any>();
  @Input() public _USER: any;
  @Input() public isLoading = true;
  @Input() public projectList: any = [];
  @Input() public timeframe: any = [];
  @Input() public projectId = 0;
  constructor(public helper: HelperService) {
  }
  pushPage(p) {
    if (this.projectId) {
      this.helper.pushPage(APP_PAGES.STEPS, {data: p, cUser: this._USER, timeframe: this.timeframe, projectId: this.projectId});
    } else {
      this.helper.pushRootPage(APP_PAGES.STEPS, {data: p, cUser: this._USER, timeframe: this.timeframe, projectId: this.projectId});
    }
    this.onPushPageTrigger.emit(true);
  }
}
