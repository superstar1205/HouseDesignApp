import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonContent, ModalController, NavController, NavParams, Platform} from '@ionic/angular';
import {ACF_FC_LAYOUT, APP_PAGES, PURPOSE, SITE_URLS, STORAGE_GET_DATA, USER_TYPES, VARS} from '../../app-constants.service';
import {FormGroup} from '@angular/forms';
import {ApiService} from '../../Services/api/api.service';
import {ModalService} from '../../Services/modal/modal.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {StaticService} from '../../Services/static/static.service';
import {INPUT_TYPE_NAME} from '../../keyOf';
import _ from 'lodash';

@Component({
  selector: 'app-edit-scope',
  templateUrl: './edit-scope.page.html',
  styleUrls: ['./edit-scope.page.scss'],
})
export class EditScopePage implements OnInit, OnDestroy {
  @ViewChild(IonContent, {static: false}) scrollArea: IonContent;
  _: any = _; AFL = ACF_FC_LAYOUT; _UT = USER_TYPES;
  _USER: any; userId = 0; userType: any;
  data: any; pStep = 0; totalFieldCount = 0;
  displayRepeater = false; displayRepeaterArr: any = [];
  postData: any = {
    scopeMargin: 0,
    projectPrice: 0,
    projectId: 0,
    agentToken: 0
  };
  headerOptions: any = {
    progress: 0,
    projectName: ''
  }; hardWareBackBtn: any;
  scopeId = 0;
  constructor(private el: ElementRef,
              private api: ApiService,
              public helper: HelperService,
              private platform: Platform) {
    this.setValues();
  }
  setUser(cUser) {
    if (cUser) {
      this._USER = cUser;
      this.userId = StaticService.getUser(cUser, STORAGE_GET_DATA.USER_ID);
      this.userType = StaticService.getUser(cUser, STORAGE_GET_DATA.USER_ROLE);
    }
  }
  setValues() {
    this.helper.navParams().then((params: any) => {
      if (params) {
        this.scopeId = params.scopeId ? params.scopeId : 0;
        this.postData.projectId = params.projectId || 0;
        this.setUser(params.user);
        this.api.apiCall(PURPOSE.GET_EDIT_QUOTE_DATA, {
          projectId: params.projectId,
          scopeId: this.scopeId,
          currentUserId: StaticService.getUser(params.user, STORAGE_GET_DATA.USER_ID)
        }).then((resData: any) => {
          if (ApiService._successRes(resData)) {
            this.data = resData.data;
            this.postData.scopeMargin = resData.data.scopeMargin;
            this.postData.projectPrice = resData.data.total_price;
            this.headerOptions.projectName = resData.data.scopeDataArray.projectName;
            this.totalFieldCount = _.toNumber(this.data.acf.quote_fields.length);
            _.forEach(this.data.acf.quote_fields, v => {
              const thisLayout = v.acf_fc_layout;
              if (thisLayout === ACF_FC_LAYOUT.EXCLUSIONS) {
                if (!(StaticService.userTypeHA(this.userType))) {
                  this.data.acf.quote_fields = _.filter(this.data.acf.quote_fields, (rv) => {
                    return (rv.acf_fc_layout !== ACF_FC_LAYOUT.EXCLUSIONS);
                  });
                  this.totalFieldCount--;
                }
              }
            });
            const tempRepeaterLength = !!((this.data.displayRepeater.length) && StaticService.userTypeHAS(this.userType));
            if (tempRepeaterLength) {
              this.totalFieldCount++;
              this.data.acf.quote_fields.push({
                acf_fc_layout: 'display_repeater',
                title: 'Add manual items',
                slug: 'display_repeater',
                description: 'This is where you can add manual items to your quote, this is for project specific scope that you haven\'t created options for. All totals will be added to the grand total.'
              });
              _.forEach(this.data.displayRepeater, (v) => {
                this.displayRepeaterArr.push({ customQuoteFieldTitle: v.customQuoteFieldTitle, customQuoteFieldPrice: v.customQuoteFieldPrice, customQuoteFieldDescription: v.customQuoteFieldDescription });
              });
              this.helper.toggleShowHide(this.displayRepeaterArr, this.displayRepeaterArr[0]);
            }
            this.headerOptions = {
              isProjectName: true,
              canEditProjectName: true,
              isProgressBar: true,
              projectName: this.data.title.rendered,
              progress: ((this.pStep + 1) / this.totalFieldCount)
            };
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      this.hardWareBackBtn = this.platform.backButton.subscribeWithPriority(9999, async () => {
        this.onStep('setRoot');
      });
      setTimeout(() => {
        try {
          this.scrollArea.scrollToBottom(100);
        } catch (e) {
        }
      }, 100);
    });
  }
  ngOnDestroy() {
    try {
      this.hardWareBackBtn.unsubscribe();
    } catch (e) { }
  }
  calPrice() {
    // this.api.cancelRequest();
    setTimeout(() => {
      const data = this.data;
      data.displayRepeaterArr = this.displayRepeaterArr;
      const postData = this.postData;
      postData.projectName = this.headerOptions.projectName;
      postData.templateId = data.id;
      _.forEach(postData, (val, key) => {
        data[key] = val;
      });
      this.api.apiCall(PURPOSE.CALCULATE_PRICE, {data}, false, false).then((res: any) => {
        if (ApiService._successRes(res)) {
          this.postData.projectPrice = res.data;
        }
      }).catch(() => {});
    }, 0);
  }
  onStep(nav = null) {
    if (nav === 'back' || nav === 'setRoot') {
      if (!this.pStep || nav === 'setRoot') {
        this.helper.presentAlertConfirm('Are you sure you want to leave?', 'All quote data will be lost', 'Leave', 'Resume').then(isConfirm => {
          if (isConfirm) {
            this.helper.pushRootPage(APP_PAGES.ESTIMATE, {selectedTab: 'Estimate'});
          }
        });
      } else {
        this.pStep--;
        this.headerOptions.progress = ((this.pStep + 1) / this.data.acf.quote_fields.length);
      }
    } else {
      console.log('pstep', this.pStep, this.totalFieldCount);
      if ((this.pStep + 1) === this.totalFieldCount) {
        this.saveDetails();
      } else {
        this.pStep++;
        this.headerOptions.progress = ((this.pStep + 1) / this.data.acf.quote_fields.length);
      }
    }
    this.calPrice();
  }
  oBj(isFiled = true, fields = 'fields') {
    return isFiled ? this.data.acf.quote_fields[this.pStep][fields] : this.data.acf.quote_fields[this.pStep];
  }
  itemSelect(i, type = 'inc', fields = 'fields') {
    if (this.oBj(false, fields).type_of_fields === 'Radio' && !this.oBj()[i].quantity) {
      _.forEach(this.oBj(), v => {
        v.isSelected = false;
      });
      this.oBj()[i].isSelected = !this.oBj()[i].isSelected;
    } else {
      if (type === 'img') {
        if (this.oBj()[i].checked === 'yes') {
          this.oBj()[i].isSelected = (this.oBj()[i].isSelected > 0) ? 1 : (_.toInteger(this.oBj()[i].isSelected) + _.toInteger(this.oBj()[i].default_quantity));
        } else {
          this.oBj()[i].isSelected = (this.oBj()[i].isSelected > 0) ? 0 : (_.toInteger(this.oBj()[i].isSelected) + 1);
        }
        // this.oBj()[i].isSelected = (this.oBj()[i].isSelected > 0) ? 0 : (_.toInteger(this.oBj()[i].isSelected) + 1);
      } else if (type === 'inc') {
        this.oBj()[i].isSelected = _.toInteger(this.oBj()[i].isSelected) + 1;
      } else if (type === 'dec') {
        if (this.oBj()[i].checked === 'yes') {
          this.oBj()[i].isSelected = (this.oBj()[i].isSelected > 2) ? (_.toInteger(this.oBj()[i].isSelected) - 1) : 1;
        } else {
          this.oBj()[i].isSelected = (this.oBj()[i].isSelected > 1) ? (_.toInteger(this.oBj()[i].isSelected) - 1) : 0;
        }
        // this.oBj()[i].isSelected = (this.oBj()[i].isSelected > 1) ? (_.toInteger(this.oBj()[i].isSelected) - 1) : 0;
      } else if (type === 'toggle') {
        this.oBj(true, fields)[i].isSelected = !this.oBj(true, fields)[i].isSelected;
      }
    }
    this.calPrice();
  }
  repeaterItem(i = 0, type = 'add') {
    if (type === 'remove') {
      if (this.displayRepeaterArr.length > 1) {
        this.displayRepeaterArr = _.filter(this.displayRepeaterArr, (val, key) => {
          return (key !== i);
        });
      }
    } else {
      this.displayRepeaterArr.push({ customQuoteFieldTitle: '' });
    }
  }
  saveDetails() {
    this.data.displayRepeaterArr = this.displayRepeaterArr;
    this.postData.projectName = this.headerOptions.projectName;
    this.postData.templateId = this.data.id;
    _.forEach(this.postData, (val, key) => {
      this.data[key] = val;
    });
    this.data.api_key = VARS.API_KEY;
    this.data.purpose = PURPOSE.SAVE_EDIT_SCOPE;
    console.log('this.data', this.data);
    this.helper.presentLoadingWithOptions('Saving data...').catch(() => {});
    this.api.apiCall(this.data.purpose, this.data).then((saveRes: any) => {
      if (ApiService._successRes(saveRes)) {
        this.helper.popPage();
      }
      this.helper.dismissLoading();
    }).catch(() => {});
  }
}
