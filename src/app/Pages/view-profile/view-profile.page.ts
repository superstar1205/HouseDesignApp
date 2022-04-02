import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../Services/api/api.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {PURPOSE} from '../../app-constants.service';
import {ModalService} from '../../Services/modal/modal.service';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {
  loadingUser = true; personal: any; userId = 0; QuotesD: any; ReviewsD: any;
  _NOTIF: any = []; _MSG: any = [];
  msgInterval: any; notInterval: any;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: ModalService,
              private api: ApiService,
              public helper: HelperService) {
      this.activatedRoute.queryParams.subscribe(async () => {
          const routParams = this.router.getCurrentNavigation().extras.state;
          if (routParams) {
            this.personal = routParams.data;
            this.userId = routParams.userId;
            this.getNotification();
            this.getMessage();
          }
      });
  }

  ngOnInit() {
    this.RQDetails();
  }
  ionViewDidLeave() {
    /*try {
      clearInterval(this.msgInterval);
    } catch (e) {}
    try {
      clearInterval(this.notInterval);
    } catch (e) {}*/
  }
  ionViewWillEnter() {
    this.getMessage();
    this.getNotification();
    /*this.msgInterval = setInterval(() => {
      this.getMessage();
    }, 5000);
    this.notInterval = setInterval(() => {
      this.getNotification();
    }, 5000);*/
  }

  RQDetails() {
    this.api.apiCall(PURPOSE.GET_REVIEW_QUOTES, {
        user_id: this.userId
    }).then((res: any) => {
        if (ApiService._successRes(res)) {
          this.ReviewsD = res.data.reviews;
          this.QuotesD = res.data.qoutes;
        }
        this.loadingUser = false;
    }).catch(() => {});
  }
  btn(type) {
    if (type === 'NotiBell') {
      this.modalService.openModal('notifications', 'Notifications', {notifications: this._NOTIF, id: null}, 'notificationsModal').catch(() => {});
    } else if (type === 'Message') {
      this.modalService.openModal('messages', 'Messages', {messages: this._MSG, id: null}, 'msgsModal').catch(() => {});
    }
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
