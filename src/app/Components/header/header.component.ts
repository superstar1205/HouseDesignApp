import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IMGS, PURPOSE, STORAGE_GET_DATA} from '../../app-constants.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {ApiService} from '../../Services/api/api.service';
import {AuthService} from '../../core/auth/auth.service';
import {ModalService} from '../../Services/modal/modal.service';
import {StaticService} from '../../Services/static/static.service';
import _ from 'lodash';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() onTriggerBtn = new EventEmitter<any>();
  @Output() onChangeInp = new EventEmitter<any>();
  @Input() public scrollArea = null;
  @Input() public headerType = '_BASIC';
  @Input() public options: any = {};
  @Input() public showMsg = null;
  _IMG = IMGS; loadingUser = true;
  _ME: any; ME_ID = 0; _NOTIF: any = []; _MSG: any = [];
  msgInterval: any; notInterval: any;
  constructor(private auth: AuthService,
              private helper: HelperService,
              private api: ApiService,
              private modalService: ModalService) {
    this.auth.authState$.subscribe(state => {
      if (state === true) {
        this.auth.getSavedUser().then((user) => {
          this._ME = user;
          this.ME_ID = StaticService.getUser(this._ME, STORAGE_GET_DATA.USER_ID);
          this.getNotification();
          this.getMessage();
          this.loadingUser = false;
        }).catch(() => {});
      } else {
        this._ME = null;
        this.loadingUser = false;
      }
    });
  }
  ngOnInit() {
    this.msgInterval = setInterval(() => {
      this.getMessage();
    }, 10000);
    this.notInterval = setInterval(() => {
      this.getNotification();
    }, 10000);
  }
  ngOnDestroy() {
    try {
      clearInterval(this.msgInterval);
    } catch (e) {}
    try {
      clearInterval(this.notInterval);
    } catch (e) {}
  }
  onBtnTrigger(btn: any, data = null) {
    this.onTriggerBtn.emit({ returnType: btn, data });
    if (btn === '_BELL') {
      this.modalService.openModal('notifications', 'Notifications', {notifications: this._NOTIF, id: null}, 'notificationsModal').then(() => {
        this.getNotification();
      }).catch(() => {});
    }
    if (btn === '_MESSAGE') {
      this.modalService.openModal('messages', 'Messages', {messages: this._MSG, id: null}, 'msgsModal').then(() => {
        this.getMessage();
      }).catch(() => {});
    }
  }
  onChangeIn(val) {
    this.onChangeInp.emit(val);
  }
  getNotification() {
    this.api.getNotification(null, true).then((res) => {
      if (res) { this._NOTIF = res; }
    }).catch(() => {});
  }
  getMessage() {
    this.api.getMessages(null, true).then((res) => {
      if (res) {
        this._MSG = res;
      }
    }).catch(() => {});
  }
}
