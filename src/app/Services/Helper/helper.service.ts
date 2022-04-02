import {Injectable, QueryList, ViewChildren} from '@angular/core';
import {ADD_PEOPLE_SELECT, APP_PAGES, IMGS, VALIDATION_MSG, VARS} from '../../app-constants.service';
import {
  ActionSheetController,
  AlertController,
  IonRouterOutlet,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from '@ionic/angular';
import {Toast} from '@ionic-native/toast/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {DatePipe} from '@angular/common';
import _ from 'lodash';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {ActivatedRoute, Router} from '@angular/router';

declare var window;
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  lastTimeBackPress = 0; timePeriodToExit = 2000;

  DH: any = 0; DW: any = 0; _MOMENT = moment; _LODASH = _;
  _IMG = IMGS; _VAR = VARS; _VM = VALIDATION_MSG; _AP = APP_PAGES;
  loading; toast;
  constructor(private platform: Platform,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private popOverCtrl: PopoverController,
              private menuCtrl: MenuController,
              private nativeToast: Toast,
              private keyboard: Keyboard,
              private statusBar: StatusBar,
              private datePipe: DatePipe,
              private navCtrl: NavController,
              private appVersion: AppVersion,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.platform.ready().then(() => {
      this.DH = this.platform.height();
      this.DW = this.platform.width();
    }).catch(() => {});
  }
  getDatePipe(val, format = null) {
    return format ? this.datePipe.transform(val, format) : this.datePipe.transform(val);
  }
  getCDT(format = null, date = null) {
    return format ? momentTz.tz(date ? date : moment().toDate(), VARS.APP_TIMEZONE).format(format) : momentTz.tz(date ? date : moment().toDate(), VARS.APP_TIMEZONE);
  }
  async presentAlert(msg, subHeader = null, header = null, okBtn: any = ['OK']) {
    this.dismissLoading();
    if (msg) {
      const alert = await this.alertCtrl.create({
        header,
        subHeader,
        message: msg,
        buttons: okBtn
      });
      await alert.present();
    }
  }
  async presentLoadingWithOptions(msg= 'Please wait...', customCssClass= 'myLoader') {
    this.dismissLoading();
    this.loading = await this.loadingCtrl.create({
      id: 'myLoader',
      spinner: 'bubbles',
      message: msg,
      translucent: true,
      cssClass: customCssClass
    });
    return await this.loading.present();
  }
  async presentNewToast(msg = 'No action required.', dur = '2000', pos = 'center', styling = null) {
    this.dismissLoading();
    if (this.platform.is('android') || this.platform.is('ios')) {
      try {
        this.nativeToast.hide().catch(() => {
        });
      } catch (e) {
      }
      this.nativeToast.showWithOptions({
        message: msg,
        duration: _.toNumber(dur),
        position: pos,
        addPixelsY: pos === 'bottom' ? (-150) : 0,
      }).subscribe(() => {
      });
    } else {
      try {
        this.toastCtrl.dismiss().catch(() => {
        });
      } catch (e) {
      }
      this.toast = await this.toastCtrl.create({
        message: msg,
        duration: +dur,
        position: pos === 'center' ? 'middle' : pos === 'top' ? 'top' : 'bottom'
      });
      this.toast.present().catch(() => {
      });
    }
  }
  presentAlertConfirm(head = 'Confirm!', msg = '', confirmText = 'Okay', cancelText = 'Cancel', cancelBtnClass = 'cancelBtn ion-text-capitalize', confirmBtnClass = 'confirmBtn ion-text-capitalize') {
    this.onScrollCloseKeyBoard();
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: head,
        message: msg,
        cssClass: 'myAlert',
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: cancelBtnClass,
            handler: () => {
              return reject(false);
            }
          }, {
            text: confirmText,
            cssClass: confirmBtnClass,
            handler: () => {
              return resolve(true);
            }
          }
        ]
      });
      setTimeout(async () => {
        await alert.present();
      }, 100);
    }).catch(() => {});
  }
  dismissLoading() {
    try { this.loading.dismiss().catch(() => {}); } catch (e) {}
  }
  onScrollCloseKeyBoard() {
    if (this.platform.is('android')) {
      try { window.Keyboard.hide(); } catch (e) { }
    }
    if (this.platform.is('ios')) {
      try { this.keyboard.hide(); } catch (e) { }
    }
  }
  toggleShowHide(array, obj: any = {}, alwaysOpen = false) {
    const initState = obj.isOpen;
    _.forEach(array, val => {
      val.isOpen = false;
    });
    alwaysOpen ? obj.isOpen = true : obj.isOpen = !initState;
    return true;
  }
  scrollTo(scrollLabel = null, content = null, toTop = false, bottom = false) {
    try {
      setTimeout(async () => {
        if (toTop) {
          await content.scrollToTop( 400);
        } else if (bottom) {
          await content.scrollToBottom( 400);
        } else {
          if (scrollLabel && content) {
            const yOffset = document.getElementById(scrollLabel).offsetTop;
            await content.scrollToPoint(0, ((this.DH) < yOffset) ? (this.DH) : yOffset, 400);
          }
        }
      }, 100);
    } catch (e) {}
    /*if (obj.isOpen && scrollLabel && content) {
      this.scrollTo(scrollLabel, content);
    }*/
  }
  async closeAllPopups() {
    try {
      const element = await this.loadingCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.actionSheetCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.popOverCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.modalCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.menuCtrl.getOpen();
      if (element) { this.menuCtrl.close().catch(() => {}); }
    } catch (error) {}
  }
  async onFilter(filterOptArr, selectedVal = null) {
    this.onScrollCloseKeyBoard();
    return new Promise(async resolve => {
      const actionButtons = [];
      _.forEach(filterOptArr, (val) => {
        actionButtons.push({
          text: val.title,
          cssClass: (selectedVal === val.val) ? 'action-sheet-selected' : '',
          handler: () => {
            if (selectedVal !== val.val) {
              return resolve(val.val);
            }
          }
        });
      });
      actionButtons.push({
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      });
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Filter',
        cssClass: 'myActionSheet',
        buttons: actionButtons
      });
      await actionSheet.present();
    }).catch(() => {});
  }
  loadMoreRecords(event, offset, recordsFiltered, limit: any = VARS.LIMIT_LIST, pages = true) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (pages) {
          if ((((offset - 1) * limit) + limit) < recordsFiltered) {
            offset++;
            return resolve({page: offset, limit, reload: true});
          } else {
            event.target.disabled = true;
            return resolve({page: offset, limit, reload: false});
          }
        } else {
          const currentCount = limit + offset;
          if (currentCount < recordsFiltered) {
            if ((recordsFiltered - currentCount) > limit) {
              offset += limit;
            } else {
              offset = currentCount;
              limit = (recordsFiltered - currentCount);
            }
            return resolve({offset, limit, reload: true});
          } else {
            event.target.disabled = true;
            return resolve({offset, limit, reload: false});
          }
        }
      }, 500);
    });
  }
  setStatusBar() {
    try {
      this.statusBar.overlaysWebView(true);
      this.statusBar.overlaysWebView(false);
    } catch (e) {}
  }
  pushRootPage(page, navData = null) {
    navData ? this.navCtrl.navigateRoot(page, {state: navData }).catch((e) => { console.log(e); }) : this.navCtrl.navigateRoot(page).catch((e) => { console.log(e); });
  }
  pushPage(page, navData = null) {
    navData ? this.navCtrl.navigateForward(page, {state: navData }).catch((e) => { console.log(e); }) : this.navCtrl.navigateForward(page).catch((e) => { console.log(e); });
  }
  navParams() {
    return new Promise(resolve => {
      this.activatedRoute.queryParams.subscribe(async () => {
        try {
          const routParams = this.router.getCurrentNavigation().extras.state || null;
          return resolve(routParams);
        } catch (e) {
          return resolve(undefined);
        }
      });
    });
  }
  popPage() {
    this.navCtrl.pop().catch((e) => console.log(e));
  }
  popToPage(url, navData = null) {
    navData ? this.navCtrl.navigateBack(url, {state: navData }).catch((e) => { console.log(e); }) : this.navCtrl.navigateBack(url).catch((e) => { console.log(e); });
  }
  getApp(type = 'VersionNumber') {
    return new Promise(resolve => {
      this.platform.ready().then(async () => {
        if (type === 'AppName') {
          await this.appVersion.getAppName().then((res) => {
            return resolve(res);
          }).catch(() => {});
        }
        if (type === 'PackageName') {
          return await this.appVersion.getPackageName().then((res) => {
            return resolve(res);
          }).catch(() => {});
        }
        if (type === 'VersionCode') {
          return await this.appVersion.getVersionCode().then((res) => {
            return resolve(res);
          }).catch(() => {});
        }
        if (type === 'VersionNumber') {
          await this.appVersion.getVersionNumber().then((res) => {
            return resolve(res);
          }).catch(() => {});
        }
      }).catch(() => {});
    });
  }
  async AddPeopleSelect(selectedVal = null) {
    this.onScrollCloseKeyBoard();
    return new Promise(async resolve => {
      const actionButtons = [];
      _.forEach(ADD_PEOPLE_SELECT, (val, key) => {
        actionButtons.push({
          text: val,
          cssClass: (selectedVal === key) ? 'action-sheet-selected' : '',
          handler: () => {
            // if (selectedVal !== key) {
                return resolve(key);
            // }
          }
        });
      });
      actionButtons.push({
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
            console.log('Cancel clicked');
        }
      });
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Add People',
        cssClass: 'myActionSheet',
        buttons: actionButtons
      });
      await actionSheet.present();
    }).catch(() => {});
  }

  listenBackBtn() {
    // const currentUrl = /[^/]*$/.exec(this.platform.url())[0];
    this.platform.backButton.subscribe(async () => {
      const currentUrl = this.router.url;
      console.log('currentUrl', currentUrl);
      try {
        const element = await this.loadingCtrl.getTop();
        if (element) {
          // element.dismiss().catch(() => {});
          return;
        }
      } catch (error) {}
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) { element.dismiss().catch(() => {}); return; }
      } catch (error) {}
      try {
        const element = await this.popOverCtrl.getTop();
        if (element) { element.dismiss().catch(() => {}); return; }
      } catch (error) {}
      try {
        const element = await this.modalCtrl.getTop();
        if (element) { element.dismiss().catch(() => {}); return; }
      } catch (error) {}
      try {
        const element = await this.menuCtrl.getOpen();
        if (element) { this.menuCtrl.close().catch(() => {}); return; }
      } catch (error) {}
      if (((new Date().getTime()) - this.lastTimeBackPress) < this.timePeriodToExit) {
        (navigator as any).app.exitApp();
      } else if (_.includes([APP_PAGES.ESTIMATE, APP_PAGES.PAYMENTS, APP_PAGES.ACCOUNT], currentUrl)) {
        await this.navCtrl.navigateRoot(APP_PAGES.START, {state: {selectedTab: 'Jobs'}});
      } else if (_.includes([APP_PAGES.START, APP_PAGES.JOBS, APP_PAGES.LOGIN], currentUrl)) {
        await this.presentNewToast(VARS.MSG_BACK_BUTTON, '' + this.timePeriodToExit);
        this.lastTimeBackPress = (new Date().getTime());
      }
    });
  }
}

