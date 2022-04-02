import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';
import {ApiService} from '../../Services/api/api.service';
import {ModalService} from '../../Services/modal/modal.service';
import {StaticService} from '../../Services/static/static.service';
import {PURPOSE, STORAGE_GET_DATA, SITE_URLS, USER_TYPES} from '../../app-constants.service';
import {AuthService} from '../../core/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UploaderService} from '../../Services/uploader/uploader.service';
import _ from 'lodash';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.page.html',
  styleUrls: ['./invoice-detail.page.scss'],
})
export class InvoiceDetailPage implements OnInit, OnDestroy {
  user: any; userType: any; _NOTIF: any = []; _MSG: any = []; _UT = USER_TYPES;
  isNotification = false; isLoading = true; progressBar = true;
  invoiceId = 0; details: any;
  msgInterval: any; notInterval: any;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public helper: HelperService,
              private auth: AuthService,
              private api: ApiService,
              private modalService: ModalService,
              public uploader: UploaderService) {
    this.activatedRoute.queryParams.subscribe(async () => {
      const routParams = this.router.getCurrentNavigation().extras.state;
      if (routParams) {
        this.invoiceId = routParams.invoiceId;
        this.user = routParams.user;
        this.userType = StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ROLE);
        this.getNotification();
        this.getMessage();
      }
    });
  }

  ngOnInit() {
    this.getDetails();
    this.msgInterval = setInterval(() => {
      this.getMessage();
    }, 5000);
    this.notInterval = setInterval(() => {
      this.getNotification();
    }, 5000);
  }
  ngOnDestroy() {
    try {
      clearInterval(this.msgInterval);
    } catch (e) {}
    try {
      clearInterval(this.notInterval);
    } catch (e) {}
  }
  btn(type) {
    if (type === 'NotiBell') {
      this.modalService.openModal('notifications', 'Notifications', {notifications: this._NOTIF, id: this.invoiceId}, 'notificationsModal').catch(() => {});
    } else if (type === 'Message') {
      this.modalService.openModal('messages', 'Messages', {messages: this._MSG, id: this.invoiceId}, 'msgsModal').catch(() => {});
    } else if (type === 'mark_as_paid' || type === 'remind') {
      this.helper.presentAlertConfirm('Confirm!', (type === 'mark_as_paid') ? 'Are you sure you want to mark invoice as Paid?' : 'Are you sure you want to remind client about invoice?', 'Yes, please!', 'No').then(async isConfirm => {
        if (isConfirm) {
          await this.helper.presentLoadingWithOptions();
          this.api.apiCall(PURPOSE.PAYMENT_LIST_ACTION, {
            invoice_id: this.invoiceId,
            action: type
          }, true).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.getDetails();
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    } else if (type === 'downloadPdf') {
      const myFileName = 'invoice' + this.details.invoice_info.number + '.pdf';
      this.uploader.downloadFile(SITE_URLS.BASE_URL + '/tcpdf/invoice/invoice.php?invoice_id=' + this.invoiceId, myFileName);
    } else if (type === 'removeInvoice') {
      this.helper.presentAlertConfirm('Confirm', 'Do you really want to remove this Invoice?', 'Remove', 'No').then(async (isConfirm) => {
        if (isConfirm) {
          this.helper.presentLoadingWithOptions('Removing Invoice...').catch(() => {});
          this.api.apiCall(PURPOSE.DELETE_INVOICE, {
            invoiceId: this.invoiceId
          }, true).then((res) => {
            this.helper.dismissLoading();
            if (ApiService._successRes(res)) {
              this.helper.popPage();
            }
          });
        }
      }).catch(() => {});
    }
  }
  getDetails() {
    this.progressBar = true;
    this.api.apiCall(PURPOSE.GET_PAYMENT_DETAILS, {
      invoice_id: this.invoiceId,
      current_user_id: StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID)
    }).then((res: any) => {
      if (ApiService._successRes(res)) {
        this.details = res.data;
      }
      this.isLoading = this.progressBar = false;
    }).catch(() => {});
  }
  getNotification() {
    this.api.getNotification(null, true).then((res) => {
      if (res) { this._NOTIF = res; }
    }).catch(() => {});
  }
  getMessage() {
    this.api.getMessages(this.invoiceId, true).then((res) => {
      if (res) {
        this._MSG = res;
      }
    }).catch(() => {});
  }
}
