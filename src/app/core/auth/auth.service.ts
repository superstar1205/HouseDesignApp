import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage';
import {Events, NavController, Platform} from '@ionic/angular';
import {APP_PAGES, STORAGE_GET_DATA, USER_TYPES, VALIDATION_MSG, VARS} from '../../app-constants.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {StaticService} from '../../Services/static/static.service';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  notificationData = null; isSplashShown = true;
  constructor(private storage: Storage,
              private platform: Platform,
              private navCtrl: NavController,
              private helper: HelperService,
              private oneSignal: OneSignal,
              private splashScreen: SplashScreen,
              private event: Events,
              private zone: NgZone) {
    this.platform.ready().then( () => {
      this.checkIfLoggedIn(true);
      this.handelNotification();
    });
  }
  handelNotification() {
    this.event.subscribe('HOUSEACE_NOTI_OPENED', (jsonData) => {
      this.zone.run(() => {
        this.notificationData = jsonData;
        this.checkIfLoggedIn(true);
      });
    });
  }
  /*handelNotification() {
    this.event.subscribe('HOUSEACE_NOTI_OPENED', (jsonData) => {
      this.zone.run(() => {
        this.notificationData = jsonData;
        this.getSavedUser().then((USER) => {
          this.authState$.next(!!(USER));
          if (USER) {
            if (jsonData.notiType && (_.includes(['new_quote', 'new_message', 'new_reply', 'project_status_change', 'new_payment', 'finish_schedule_section', 'added_contractor_to_project', 'added_agent', 'added_supplier', 'invoice_paid', 'leave_review_once_competed', 'reminder_mail', 'payment_reminder', 'new_variation'], jsonData.notiType))) {
              // let paramData: any = null;
              let selectedSegment = null;
              if (_.includes(['new_quote', 'new_message', 'new_reply', 'project_status_change', 'new_payment', 'finish_schedule_section', 'added_contractor_to_project', 'added_agent', 'added_supplier', 'leave_review_once_competed', 'reminder_mail', 'new_variation'], jsonData.notiType)) {
                if (jsonData.notiType === 'new_quote' || jsonData.notiType === 'reminder_mail' || jsonData.notiType === 'project_status_change' || jsonData.notiType === 'leave_review_once_competed') {
                  // paramData = { state: { detailJobId: jsonData.pId } };
                }
                if (jsonData.notiType === 'new_payment' || jsonData.notiType === 'new_variation') {
                  // paramData = { state: { detailJobId: jsonData.pId, selectedSegment: 'Payments' } };
                  selectedSegment = 'Payments';
                }
                if (jsonData.notiType === 'finish_schedule_section') {
                  // paramData = { state: { detailJobId: jsonData.pId, selectedSegment: 'Schedule' } };
                  selectedSegment = 'Schedule';
                }
                if (jsonData.notiType === 'new_message' || jsonData.notiType === 'new_reply' || jsonData.notiType === 'added_contractor_to_project' || jsonData.notiType === 'added_agent' || jsonData.notiType === 'added_supplier') {
                  // paramData = { state: { detailJobId: jsonData.pId, selectedSegment: 'Activity' } };
                  selectedSegment = 'Activity';
                }
                this.navCtrl.navigateRoot(APP_PAGES.START).then(() => {
                  this.navCtrl.navigateForward(APP_PAGES.DETAIL_QUOTE, { state: {
                      pId: jsonData.pId, user: USER, selectedSegment }}).then(() => {
                    this.hideSplashOverlay();
                  }).catch(() => {});
                }).catch(() => {});
              } else if (jsonData.notiType === 'payment_reminder') {
                const userType = StaticService.getUser(USER, STORAGE_GET_DATA.USER_ROLE);
                if (userType && userType === USER_TYPES.HEAD_CONTRACTOR || userType === USER_TYPES.AGENT) {
                  this.navCtrl.navigateRoot(APP_PAGES.PAYMENTS).then(() => {
                    this.navCtrl.navigateForward(APP_PAGES.INVOICE_DETAIL, {state: { invoiceId: jsonData.invoiceId, user: USER}}).then(() => {
                      this.hideSplashOverlay();
                    }).catch(() => {});
                  }).catch(() => {});
                } else {
                  this.navCtrl.navigateRoot(APP_PAGES.START).then(() => {
                    this.hideSplashOverlay();
                  }).catch(() => {});
                }
              } else if (jsonData.notiType === 'invoice_paid') {
                if (jsonData.pId) {
                  selectedSegment = 'Payments';
                  this.navCtrl.navigateRoot(APP_PAGES.START).then(() => {
                    this.navCtrl.navigateForward(APP_PAGES.DETAIL_QUOTE, { state: {
                        pId: jsonData.pId, user: USER, selectedSegment }}).then(() => {
                      this.hideSplashOverlay();
                    }).catch(() => {});
                  }).catch(() => {});
                } else if (jsonData.invoiceId) {
                  this.navCtrl.navigateRoot(APP_PAGES.PAYMENTS).then(() => {
                    this.navCtrl.navigateForward(APP_PAGES.INVOICE_DETAIL, {state: { invoiceId: jsonData.invoiceId, user: USER}}).then(() => {
                      this.hideSplashOverlay();
                    }).catch(() => {});
                  }).catch(() => {});
                } else {
                  this.navCtrl.navigateRoot(APP_PAGES.START).then(() => {
                    this.hideSplashOverlay();
                  }).catch(() => {});
                }
              } else {
                this.navCtrl.navigateRoot(APP_PAGES.START).then(() => {
                  this.hideSplashOverlay();
                }).catch(() => {});
              }
            } else {
              this.navCtrl.navigateRoot(APP_PAGES.START).then(() => {
                this.hideSplashOverlay();
              }).catch(() => {});
            }
          } else if (!USER) {
            this.navCtrl.navigateRoot(APP_PAGES.LOGIN).then(() => {
              this.hideSplashOverlay();
            }).catch(() => {});
          }
        }).catch(() => {});
      });
    });
  }*/
  private checkIfLoggedIn(setRoot) {
    this.getSavedUser().then((USER) => {
      this.authState$.next(!!(USER));
      if (!USER && setRoot) {
        this.navCtrl.navigateRoot(APP_PAGES.LOGIN).then(() => {
          this.hideSplashOverlay();
        }).catch(() => {});
      } else if (USER && setRoot) {
        if (this.notificationData) {
          setTimeout(() => {
            this.handleRedirects(USER, this.notificationData);
          }, 100);
        } else {
          this.navCtrl.navigateRoot(APP_PAGES.START, {state: {selectedTab: 'Jobs'}}).then(() => {
            this.hideSplashOverlay();
          }).catch(() => {});
        }
      }
    }).catch(() => {});
  }
  public isAuthenticated() {
    return this.authState$.value;
  }
  public saveUserData(userData, setRoot, checkLogin = true) {
    return new Promise((resolve) => {
      this.storage.set(VARS.SG_HOUSEACE_USER_KEY, userData).then(() => {
        this.event.publish('SG_HOUSEACE_USER_UPDATED');
        this.oneSignal.setSubscription(true);
        this.oneSignal.sendTags({ user_id: userData.userId });
        if (checkLogin) {
          this.checkIfLoggedIn(setRoot);
        }
        return resolve(userData);
      }).catch(() => {});
    });
  }
  public getSavedUser(resType: STORAGE_GET_DATA = null): Promise<any> {
    return Promise.resolve(this.storage.get(VARS.SG_HOUSEACE_USER_KEY).then((value: any) => {
      return StaticService.getUser(value, resType);
    }).catch(e => e));
  }
  public logout(showToast = true, prompt = false, msg = null) {
    this.helper.closeAllPopups().catch(() => {});
    if (prompt) {
      this.helper.presentAlertConfirm('Confirm!', 'Are you sure want to logout of this app?', 'Logout', 'Cancel', 'cancelBtnInvert',  'confirmBtnInvert').then(async (res) => {
        if (res) {
          this.clearAndSetData(showToast, msg);
        }
      }).catch(() => {});
    } else {
      this.clearAndSetData(showToast, msg);
    }
  }
  private clearAndSetData(showToast, msg) {
    this.storage.remove(VARS.SG_HOUSEACE_USER_KEY).then(async () => {
      await this.storage.clear();
      this.event.publish('USER_UPDATED_LOGOUT');
      this.checkIfLoggedIn(true);
      if (showToast) { this.helper.presentNewToast(msg ? msg : VALIDATION_MSG.ERR_LOGOUT, '1000', 'bottom').catch(() => {}); }
      this.helper.closeAllPopups().catch(() => {});
      this.oneSignal.sendTags({ user_id: 0 });
      this.oneSignal.setSubscription(false);
    }).catch(() => {});
  }
  private hideSplashOverlay() {
    if (this.isSplashShown) {
      this.splashScreen.hide();
      this.isSplashShown = false;
    }
    this.event.publish('HS_HIDE_SPLASH_OVERLAY');
    // this.notificationData = null;
  }
  private handleRedirects(USER, jsonData) {
    /*
    * ['new_quote', 'new_message', 'new_reply', 'project_status_change', 'new_payment', 'finish_schedule_section', 'added_contractor_to_project', 'added_agent', 'added_supplier', 'invoice_paid', 'leave_review_once_competed', 'reminder_mail', 'payment_reminder', 'new_variation']
    *
    * */
    this.helper.closeAllPopups();
    const userType = StaticService.getUser(USER, STORAGE_GET_DATA.USER_ROLE);
    const nt = jsonData.notiType;
    if (_.includes(['new_quote', 'new_message', 'new_reply', 'project_status_change', 'new_payment', 'finish_schedule_section', 'added_contractor_to_project', 'added_agent', 'added_supplier', 'leave_review_once_competed', 'reminder_mail', 'new_variation'], nt)) {
      const selectedSegment = (_.includes(['new_payment', 'new_variation'], nt)) ? 'Payments' : (_.includes(['finish_schedule_section'], nt)) ? 'Schedule' : (_.includes(['new_message', 'new_reply', 'added_contractor_to_project', 'added_agent', 'added_supplier'], nt)) ? 'Activity' : null;
      setTimeout(() => {
        this.navCtrl.navigateRoot(APP_PAGES.START, {state: {selectedTab: 'Jobs'}}).then(() => {
          if (jsonData.pId) {
            setTimeout(() => {
              this.navCtrl.navigateForward(APP_PAGES.DETAIL_QUOTE, { state: { pId: jsonData.pId, user: USER, selectedSegment }}).then(() => {
                this.hideSplashOverlay();
              }).catch(() => {});
            }, 100);
          } else {
            this.hideSplashOverlay();
          }
        }).catch(() => {
        });
      }, 0);
    } else if (nt === 'payment_reminder' && userType && userType === USER_TYPES.HEAD_CONTRACTOR || userType === USER_TYPES.AGENT) {
      setTimeout(() => {
        this.navCtrl.navigateRoot(APP_PAGES.PAYMENTS, {state: {selectedTab: 'Payments'}}).then(() => {
          setTimeout(() => {
            if (jsonData.invoiceId) {
              this.navCtrl.navigateForward(APP_PAGES.INVOICE_DETAIL, {state: { invoiceId: jsonData.invoiceId, user: USER}}).then(() => {
                this.hideSplashOverlay();
              }).catch(() => {});
            } else {
              this.hideSplashOverlay();
            }
          }, 100);
        }).catch(() => {});
      }, 0);
    } else if (nt === 'invoice_paid' && jsonData.pId) {
      this.navCtrl.navigateRoot(APP_PAGES.START, {state: {selectedTab: 'Jobs'}}).then(() => {
        this.navCtrl.navigateForward(APP_PAGES.DETAIL_QUOTE, { state: {pId: jsonData.pId, user: USER, selectedSegment: 'Payments' }}).then(() => {
          this.hideSplashOverlay();
        }).catch(() => {});
      }).catch(() => {});
    } else if (nt === 'invoice_paid' && jsonData.invoiceId) {
      setTimeout(() => {
        this.navCtrl.navigateRoot(APP_PAGES.PAYMENTS, {state: {selectedTab: 'Payments'}}).then(() => {
          setTimeout(() => {
            this.navCtrl.navigateForward(APP_PAGES.INVOICE_DETAIL, {state: { invoiceId: jsonData.invoiceId, user: USER}}).then(() => {
              this.hideSplashOverlay();
            }).catch(() => {});
          }, 100);
        }).catch(() => {});
      }, 0);
    } else {
      this.navCtrl.navigateRoot(APP_PAGES.START, {state: {selectedTab: 'Jobs'}}).then(() => {
        this.hideSplashOverlay();
      }).catch(() => {});
    }
  }
}

