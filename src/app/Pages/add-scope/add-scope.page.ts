import { Component, OnInit } from '@angular/core';
import {PURPOSE} from '../../app-constants.service';
import {ApiService} from '../../Services/api/api.service';
import {HelperService} from '../../Services/Helper/helper.service';
import _ from 'lodash';

@Component({
  selector: 'app-add-scope',
  templateUrl: './add-scope.page.html',
  styleUrls: ['./add-scope.page.scss'],
})
export class AddScopePage implements OnInit {
  _: any = _; _USER: any; isLoading = true; projectList: any = []; timeframe: any = []; projectId = 0;
  constructor(private api: ApiService,
              public helper: HelperService) {
    this.helper.navParams().then((params: any) => {
      if (params) {
        this._USER = params.user;
        this.projectId = params.projectId;
      }
    }).catch(() => {});
  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.isLoading = true;
      this.getData();
    }, 0);
  }
  ngOnInit() {
  }
  getData() {
    this.api.apiCall(PURPOSE.GET_TEMPLATE, {}, false).then((res: any) => {
      if (ApiService._successRes(res)) {
        if (!_.isEqual(this.projectList, res.data)) {
          this.projectList = [];
          this.projectList = res.data;
        }
        if (!_.isEqual(this.timeframe, res.timeframe)) {
          this.timeframe = [];
          this.timeframe = res.timeframe;
        }
      }
      this.isLoading = false;
    }).catch(() => {});
  }
}
