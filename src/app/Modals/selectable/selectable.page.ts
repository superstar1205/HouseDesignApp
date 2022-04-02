import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {HelperService} from '../../Services/Helper/helper.service';
import {SELECT_MODAL_TYPE} from '../../keyOf';
import {ApiService} from '../../Services/api/api.service';
import {PURPOSE, VARS} from '../../app-constants.service';
import {StaticService} from '../../Services/static/static.service';
import _ from 'lodash';

@Component({
  selector: 'app-selectable',
  templateUrl: './selectable.page.html',
  styleUrls: ['./selectable.page.scss'],
})
export class SelectablePage implements OnInit {
  mType: SELECT_MODAL_TYPE = null; sTitle = 'Select'; sData: any;
  page: any = VARS.PAGE; recordsFiltered = 0;
  isLoading = true; sList: any = [];
  sCurrentSelected: any;
  searchTxt: any; lazySearch = true;
  constructor(private navParams: NavParams,
              private modalCtrl: ModalController,
              private api: ApiService,
              private helper: HelperService) {
    this.mType = this.navParams.get('mType');
    this.sTitle = this.navParams.get('headerTitle') || 'Select';
    this.sCurrentSelected = this.navParams.get('currentSelected');
    this.sData = this.navParams.get('sData');
  }
  ngOnInit() {
    if (this.mType) {
      switch (this.mType) {
        case '_HEAD_CLIENT': {
          this.sData.noDataFound = 'No user found.';
          this.getHeadClientList();
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  async dismissMe(data = null) {
    await this.modalCtrl.dismiss(data);
  }
  onChangeIn(e, type) {
    const ev = StaticService.getEveTrigger(e, type);
    this.searchTxt = ev.searchText;
    this.getHeadClientList();
  }
  getHeadClientList(refresh = false, isInfiniteScroll = false, ev = null) {
    let limit = VARS.LIMIT_LIST;
    let page = this.page;
    if (!isInfiniteScroll && !refresh) {
      this.isLoading = true;
      this.sList = [];
      this.page = page = VARS.PAGE;
    } else if (refresh && !this.isLoading) {
      limit = this.page * limit;
      page = VARS.PAGE;
    }
    if ((refresh && !this.isLoading) || !refresh) {
      this.api.apiCall(PURPOSE.GET_CLIENTS_LIST, {
        offset: page,
        search: this.searchTxt,
        limit
      }).then((res: any) => {
        if (ApiService._successRes(res)) {
          const myData = res.data.data;
          if (refresh && !this.isLoading) {
            this.sList = myData;
          } else if (!refresh) {
            _.forEach(myData, (value) => {
              this.sList.push(value);
            });
          }
        }
        this.isLoading = false;
        this.recordsFiltered = res.data.recordsFiltered || 0;
        if (ev) {
          ev.target.complete();
        }
      }).catch(() => {});
    }
  }
  loadMore(event) {
    this.helper.loadMoreRecords(event, this.page, this.recordsFiltered).then((res: any) => {
      if (res && res.reload) {
        this.page = res.page;
        this.getHeadClientList(false, true, event);
      }
    }).catch(() => {});
  }
}
