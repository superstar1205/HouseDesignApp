import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {APP_PAGES, JOB_FILTER, PURPOSE, QUOTE_STATUS, STORAGE_GET_DATA, USER_TYPES, VARS} from '../../app-constants.service';
import {ApiService} from '../../Services/api/api.service';
import _ from 'lodash';
import {NavController} from '@ionic/angular';
import {ModalService} from '../../Services/modal/modal.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StaticService} from '../../Services/static/static.service';

@Component({
  selector: 'app-jobs',
  templateUrl: 'jobs.page.html',
  styleUrls: ['jobs.page.scss']
})
export class JobsPage implements OnInit {
  loadingUser = true; _USER: any; userId = 0; userType = null; QS = QUOTE_STATUS; _UT = USER_TYPES;
  page: any = VARS.PAGE; recordsFiltered = 0;
  isLoading = true; progressBar = true; list: any = []; searchByClient = ''; searchByTitle = '';
  filterArray: any = []; filterByStatus = null;
  showMsg = false;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private api: ApiService,
              private modalService: ModalService,
              public helper: HelperService,
              public navCtrl: NavController) {
    this.filterArray = [];
    _.forEach(JOB_FILTER, (val, key) => {
      this.filterArray.push({title: key, val});
    });
    this.helper.navParams().then((routParams: any) => {
      this.auth.getSavedUser().then((user) => {
        if (user) {
          this._USER = user;
          this.userId = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ID);
          this.userType = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ROLE);
          this.loadingUser = false;
          if (routParams) {
            if (routParams.detailJobId) {
              this.quoteDetail(routParams.detailJobId, routParams.selectedSegment ? routParams.selectedSegment : 'Activity');
            }
            this.showMsg = !!routParams.showMsg;
          }
          this.getList();
        } else {
          this._USER = this.userId = this.userType = null;
          this.loadingUser = false;
        }
      }).catch(() => {});
    }).catch(() => {});
  }
  ionViewWillEnter() {
    setTimeout(() => {
      if (!(this.isLoading)) {
        this.getList(!(this.isLoading));
      }
    }, 0);
  }
  ngOnInit() {
  }
  quoteDetail(pId, selectedSegment = 'Activity') {
    this.navCtrl.navigateForward(APP_PAGES.DETAIL_QUOTE, {
      state: {
        pId, user: this._USER, selectedSegment
      }
    }).catch((e) => { console.log(e); });
  }
  cancelQuote(pId) {
    this.helper.presentAlertConfirm('Confirm', 'Are you sure you want to cancel?', 'Yes, please!', 'No').then(async (isConfirm) => {
      if (isConfirm) {
        await this.helper.presentLoadingWithOptions();
        this.api.apiCall(PURPOSE.CANCEL_PROJECT, {
          user_id: this.userId,
          project_id: pId
        }, true).then((res: any) => {
          this.getList(true);
          this.helper.dismissLoading();
        }).catch(() => {});
      }
    }).catch(() => {});
  }
  onTriggerBtn(e) {
    if (e.returnType === '_SEARCH') {
      this.modalService.openModal('searchQuotes', 'Search', {
        searchByClient: this.searchByClient,
        searchByTitle: this.searchByTitle
      }, 'searchQuotes').then((searchRes: any) => {
        if (searchRes && !searchRes.isCancel) {
          const ev = StaticService.getEveTrigger(searchRes.responseData, 'searchModal');
          this.searchByClient = ev.searchByClient;
          this.searchByTitle = ev.searchByTitle;
          this.getList();
        }
      }).catch(() => {});
    } else if (e.returnType === 'filter') {
      const ev = StaticService.getEveTrigger(e.data, e.returnType);
      this.filterByStatus = ev.filterByStatus;
      this.getList();
    }
  }
  getList(refresh = false, isInfiniteScroll = false, ev = null) {
    if (this._USER) {
      let limit = VARS.LIMIT_LIST;
      let page = this.page;
      if (!isInfiniteScroll && !refresh) {
        this.isLoading = true;
        this.list = [];
        this.progressBar = true;
        this.page = page = VARS.PAGE;
      } else if (refresh && !this.isLoading) {
        this.progressBar = true;
        limit = this.page * limit;
        page = VARS.PAGE;
      }
      if ((refresh && !this.isLoading) || !refresh) {
        this.api.apiCall(PURPOSE.GET_PROJECTS, {
          user_id: this.userId,
          offset: page,
          search_by_client: this.searchByClient,
          search_by_title: this.searchByTitle,
          filter_by: this.filterByStatus,
          limit
        }).then((res: any) => {
          /*if (!isInfiniteScroll && !refresh) {
            this.list = [];
          }*/
          if (ApiService._successRes(res)) {
          if (refresh && !this.isLoading) {
            this.list = res.data;
          } else if (!refresh) {
            _.forEach(res.data, (value) => {
              this.list.push(value);
            });
          }
          }
          this.recordsFiltered = res.recordsFiltered || 0;
          this.isLoading = this.progressBar = false;
          if (ev) {
            ev.target.complete();
          }
        }).catch(() => {});
      }
    }
  }
  loadMore(event) {
    this.helper.loadMoreRecords(event, this.page, this.recordsFiltered).then((res: any) => {
      if (res && res.reload) {
        this.page = res.page;
        this.getList(false, true, event);
      }
    }).catch(() => {});
  }
}
