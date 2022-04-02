import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {APP_PAGES, PURPOSE, STORAGE_GET_DATA, VARS} from '../../app-constants.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {ApiService} from '../../Services/api/api.service';
import _ from 'lodash';
import {StaticService} from '../../Services/static/static.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-payments',
  templateUrl: 'payments.page.html',
  styleUrls: ['payments.page.scss']
})
export class PaymentsPage implements OnInit {
  loadingUser = true; _USER: any; userId = 0; currentTab = {title: 'All', val: ''};
  totalPending = 0; totalPaid = 0;
  listAll: any = []; listPending: any = []; listPaid: any = [];
  isLoadingAll = true; isLoadingPending = true; isLoadingPaid = true;
  pageAll: any = VARS.PAGE; pagePending: any = VARS.PAGE; pagePaid: any = VARS.PAGE;
  constructor(private auth: AuthService,
              private api: ApiService,
              public helper: HelperService,
              private navCtrl: NavController) {
    this.helper.navParams().then((params: any) => {
      if (params && params.invoiceData) {
        this.btnTrigger(params.invoiceData);
      }
    }).catch(() => {});
    this.auth.authState$.subscribe(state => {
      if (state === true) {
        this.auth.getSavedUser().then((user) => {
          this._USER = user;
          this.userId = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ID);
          this.getList();
          this.loadingUser = false;
        }).catch(() => {});
      } else {
        this._USER = null;
        this.loadingUser = false;
      }
    });
  }
  ionViewWillEnter() {
    const loadingCheck = (this.currentTab.val === 'Pending') ? !this.isLoadingPending : (this.currentTab.val === 'Paid') ? !this.isLoadingPaid : !this.isLoadingAll;
    if (loadingCheck) {
      this.getList(loadingCheck);
    }
  }
  ngOnInit() {
  }
  btnTrigger(ev) {
    if (ev && ev.returnType) {
      const type = ev.returnType;
      if (type === '_SEGMENT') {
        this.currentTab.val = ev.data;
        this.getList();
      } else if (type === 'infiniteLoading') {
        this.loadMore(ev.data);
      } else if (type === 'Detail') {
        this.navCtrl.navigateForward(APP_PAGES.INVOICE_DETAIL, {state: { invoiceId: ev.data, user: this._USER}}).catch(() => {});
      } else if (type === 'mark_as_paid' || type === 'remind') {
        this.helper.presentAlertConfirm('Confirm!', (type === 'mark_as_paid') ? 'Are you sure you want to mark invoice as Paid?' : 'Are you sure you want to remind client about invoice?', 'Yes, please!', 'No').then(async isConfirm => {
          if (isConfirm) {
            await this.helper.presentLoadingWithOptions();
            this.api.apiCall(PURPOSE.PAYMENT_LIST_ACTION, {
              invoice_id: ev.data,
              action: type
            }, true).then((res: any) => {
              if (ApiService._successRes(res)) {
                this.getList(true);
              }
            }).catch(() => {});
          }
        }).catch(() => {});
      }
    }
  }
  getList(reload = false, isInfiniteScroll = false, ev = null) {
    if (this._USER) {
      const isPending = (this.currentTab.val === 'Pending');
      const isPaid = (this.currentTab.val === 'Paid');
      const tempPage = isPending ? this.pagePending : isPaid ? this.pagePaid : this.pageAll;
      let limit = VARS.LIMIT_LIST;
      let page = tempPage;
      const loadingCheck = isPending ? (reload && !this.isLoadingPending) : isPaid ? (reload && !this.isLoadingPaid) : (reload && !this.isLoadingAll);
      if (!isInfiniteScroll && !reload) {
        if (isPending) {
          this.isLoadingPending = true;
          this.listPending = [];
          this.pagePending = page = VARS.PAGE;
        } else if (isPaid) {
          this.isLoadingPaid = true;
          this.listPaid = [];
          this.pagePaid = page = VARS.PAGE;
        } else {
          this.isLoadingAll = true;
          this.listAll = [];
          this.pageAll = page = VARS.PAGE;
        }
      } else if (loadingCheck) {
        limit = tempPage * limit;
        page = VARS.PAGE;
      }
      if (loadingCheck || !reload) {
        this.api.apiCall(PURPOSE.GET_PAYMENT_LIST, {
          offset: page,
          limit,
          status: this.currentTab.val,
          current_user_id: this.userId
        }).then((res: any) => {
          if (ApiService._successRes(res)) {
            const invoices = res.data.invoices || [];
            const invoiceStatistics = res.data.invoice_statistics;
            if (loadingCheck) {
              if (isPending) {
                this.listPending = invoices;
              } else if (isPaid) {
                this.listPaid = invoices;
              } else {
                this.listAll = invoices;
              }
            } else if (!reload) {
              if (isPending) {
                _.forEach(invoices, (value) => {
                  this.listPending.push(value);
                });
              } else if (isPaid) {
                _.forEach(invoices, (value) => {
                  this.listPaid.push(value);
                });
              } else {
                _.forEach(invoices, (value) => {
                  this.listAll.push(value);
                });
              }
            }
            this.totalPending = invoiceStatistics.pending || 0;
            this.totalPaid = invoiceStatistics.paid || 0;
          }
          if (isPending) {
            this.isLoadingPending = false;
          } else if (isPaid) {
            this.isLoadingPaid = false;
          } else {
            this.isLoadingAll = false;
          }
          if (ev) {
            ev.target.complete();
          }
        }).catch(() => {});
      }
    }
  }
  loadMore(event) {
    const isPending = (this.currentTab.val === 'Pending');
    const isPaid = (this.currentTab.val === 'Paid');
    const page = isPending ? this.pagePending : isPaid ? this.pagePaid : this.pageAll;
    const total = isPending ? this.totalPending : isPaid ? this.totalPaid : this.totalPending + this.totalPaid;
    this.helper.loadMoreRecords(event, page, total).then((res: any) => {
      if (res && res.reload) {
        if (isPending) {
          this.pagePending = res.page;
        } else if (isPaid) {
          this.pagePaid = res.page;
        } else {
          this.pageAll = res.page;
        }
        this.getList(false, true, event);
      }
    }).catch(() => {});
  }
}
