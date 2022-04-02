import {Component, NgZone} from '@angular/core';
import {Events, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {PURPOSE, API_KEYS} from './app-constants.service';
import {HelperService} from './Services/Helper/helper.service';
import {AuthService} from './core/auth/auth.service';
import {ApiService} from './Services/api/api.service';
import {OneSignal} from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  splash = true; appVersion: any;
  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private event: Events,
              private zone: NgZone,
              private helper: HelperService,
              private auth: AuthService,
              private api: ApiService,
              private oneSignal: OneSignal) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString( '#000000');
      this.initOneSignal();
      this.handleSplashOverlay();
      this.updateUserDetails();
      this.helper.listenBackBtn();
    });
  }
  initOneSignal() {
    if (this.platform.is('android') || this.platform.is('ios') || this.platform.is('cordova')) {
      this.oneSignal.startInit(API_KEYS.ONE_SIGNAL_APP_ID, API_KEYS.GOOGLE_PROJECT_NUMBER);
      this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
        this.onHandleNotification(jsonData);
      });
      this.oneSignal.inFocusDisplaying(2);
      this.oneSignal.endInit();
    }
  }
  onHandleNotification(jsonData) {
    console.log('jsonData on click notification', jsonData);
    const payLoad = jsonData.notification.payload;
    if (payLoad.hasOwnProperty('additionalData') && payLoad.additionalData) {
      this.event.publish('HOUSEACE_NOTI_OPENED', payLoad.additionalData);
    }
  }
  handleSplashOverlay() {
    this.event.subscribe('HS_HIDE_SPLASH_OVERLAY', () => {
      this.zone.run(() => {
        setTimeout(() => this.splash = false, 500);
      });
    });
    this.helper.getApp().then((res) => {
      this.appVersion = res;
    }).catch(() => {});
  }
  updateUserDetails() {
    this.auth.getSavedUser().then((data: any) => {
      if (data && data.cookie) {
        this.api.login(PURPOSE.APP_LOGIN, {
          token: data.cookie
        }, true, false, false, true);
        if (this.platform.is('android') || this.platform.is('ios')) {
          this.oneSignal.sendTags({ user_id : data.userId });
        }
      }
    }).catch(() => {});
  }
  listenEvents() {
    this.event.subscribe('SG_HOUSEACE_USER_UPDATED', () => {
      this.zone.run(() => {
        console.log('event SG_HOUSEACE_USER_UPDATED');
      });
    });
    this.event.subscribe('USER_UPDATED_LOGOUT', () => {
      this.zone.run(() => {
        console.log('event USER_UPDATED_LOGOUT');
      });
    });
  }
}
