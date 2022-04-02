import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';
import {ModalService} from '../../Services/modal/modal.service';
import {ApiService} from '../../Services/api/api.service';

@Component({
  selector: 'app-bell',
  templateUrl: './bell.component.html',
  styleUrls: ['./bell.component.scss'],
})
export class BellComponent {
  @Input() public isDisabled;
  @Input() public mId = null;
  notifications: any = [];
  constructor(public helper: HelperService,
              private modalService: ModalService,
              private api: ApiService) {
    this.api.getNotification(this.mId).then((res: any) => {
      if (res) {
        this.notifications = res;
      }
    }).catch(() => {});
  }
  async openNotification() {
    this.modalService.openModal('notifications', 'Notifications', {notifications: this.notifications, id: this.mId}, 'notificationsModal').catch(() => {});
  }
}
