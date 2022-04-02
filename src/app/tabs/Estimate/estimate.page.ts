import { Component } from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';
import {NavController} from '@ionic/angular';
import {APP_PAGES, PURPOSE} from '../../app-constants.service';
import {ApiService} from '../../Services/api/api.service';
import _ from 'lodash';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-estimate',
  templateUrl: 'estimate.page.html',
  styleUrls: ['estimate.page.scss']
})
export class EstimatePage {
  _: any = _; _USER: any; isLoading = true; projectList: any = []; timeframe: any = [];
  constructor(private navCtrl: NavController,
              private api: ApiService,
              private auth: AuthService,
              public helper: HelperService) {
    this.auth.authState$.subscribe(state => {
      if (state === true) {
        this.auth.getSavedUser().then((user) => {
          this._USER = user;
        });
      } else {
        this._USER = null;
      }
    });
  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.getData();
    }, 0);
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
       // this.testCons(res);
       this.isLoading = false;
    }).catch(() => {});
  }
  testCons(res) {
    // TODO remove function
    const cc = _.map(res.data, (val) => {
      return _.map(val.acf.quote_fields, v2 => {
        // return v2.type_of_fields;
        return v2.moods;
      });
    });
    console.log('ss', cc);
    let x = [];
    _.forEach(cc, v => {
      x = _.concat(v, x);
    });
    console.log('v', x, _.uniq(x));
    x = _.uniq(x);
    console.log('v2', x);
  }
}
