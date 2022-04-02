import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest} from '@angular/common/http';
import {APP_PAGES, PURPOSE, SITE_URLS, STORAGE_GET_DATA, VARS} from '../../app-constants.service';
import {BehaviorSubject} from 'rxjs';
import _ from 'lodash';
import {HelperService} from '../Helper/helper.service';
import {AuthService} from '../../core/auth/auth.service';
import {StaticService} from '../static/static.service';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';

const apiUrl = SITE_URLS.BASE_URL + SITE_URLS.API_URL;
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public httpEventListener: BehaviorSubject<any> = new BehaviorSubject(null);
  currentRequesting: any;
  constructor(private http: HttpClient,
              private auth: AuthService,
              private helper: HelperService,
              private navCtrl: NavController,
              private router: Router) { }
  static _successRes(res) {
    return (res && res.status && res.code && _.includes([200, 201, 202, 203, 204], res.code));
  }
  cancelRequest() {
    if (this.currentRequesting) {
      try {
        this.currentRequesting.unsubscribe();
      } catch (e) {}
    }
  }
  public login(purpose, formData, isLoginPurpose = false, presetLoading = false, setRoot = false, checkCookie = false) {
    return new Promise(resolve => {
      if (presetLoading) { this.helper.presentLoadingWithOptions().catch(() => {}); }
      this.apiCall(purpose, formData).then(async (res: any) => {
        if (ApiService._successRes(res)) {
          if (isLoginPurpose) {
            this.auth.saveUserData((purpose === PURPOSE.APP_REGISTER) ? res.loginData.data : res.data, setRoot, !checkCookie).then(async () => {
              if (presetLoading) {
                await this.helper.presentNewToast(res.message, '2000', 'bottom', 'success');
              }
              return resolve(true);
            }).catch(() => { this.helper.dismissLoading(); });
          } else {
            await this.helper.presentNewToast(res.message, '2000', 'bottom', 'success');
            return resolve(true);
          }
        } else if (res.code === 401) {
          this.auth.logout(true, false, res.message);
        }
        this.helper.dismissLoading();
      }).catch(() => { this.helper.dismissLoading(); });
    });
  }
  apiCall(purpose = null, requestData: any = {}, successToast = false, allToast = true, toastTime = '1500', toastPos = 'bottom', createForm = true, url = null, method = 'POST', specialCheck = false) {
    return new Promise(resolve => {
      url = apiUrl + (url ? url : SITE_URLS.REQUEST_HANDLER);
      let formData: any;
      if (!createForm) {
        if (!requestData || !requestData.has('api_key')) {
          requestData.append('api_key', VARS.API_KEY);
        }
        requestData.append('purpose', purpose);
        formData = requestData;
      } else {
        formData = requestData;
        if (!requestData || !requestData.api_key) {
          formData.api_key = VARS.API_KEY;
        }
        formData.purpose = purpose;
      }
      if (method === 'POST') {
        const currentReq = this.http.post(url, formData).subscribe(async (res: any) => {
          if (purpose !== 'get_messages' && purpose !== 'get_notifications') {
            console.log('postRes- ', purpose, requestData, res);
          }
          return resolve(this.handleSuccessResponse(res, successToast, allToast, toastTime, toastPos, specialCheck));
        }, async e => {
          return resolve(this.handleErrorResponse(e, toastTime, allToast));
        });
        if (purpose === PURPOSE.CALCULATE_PRICE) {
          this.currentRequesting = currentReq;
        }
      } else if (method === 'GET') {
        this.http.get(url, formData).subscribe(async (res: any) => {
          console.log('getRes- ', purpose, requestData, res);
          return resolve(this.handleSuccessResponse(res, successToast, allToast, toastTime, toastPos, specialCheck));
        }, async e => {
          return resolve(this.handleErrorResponse(e, toastTime, allToast));
        });
      }
    });
  }
  async handleSuccessResponse(res, successToast, allToast, toastTime, toastPos, specialCheck) {
    if (ApiService._successRes(res)) {
      if (successToast && allToast) { await this.helper.presentNewToast(res.message, toastTime, toastPos); }
      return (res);
    } else {
      if (res.status === false && res.code === 401) {
        this.auth.logout(true);
        return (res);
      } else {
        if (specialCheck) {
          if (!res.status && res.code !== 204 && allToast) { await this.helper.presentNewToast(res.message, toastTime, toastPos); }
        } else {
          if (allToast) {
            await this.helper.presentNewToast(res.message, toastTime, toastPos);
          }
        }
        return (res);
      }
    }
  }
  async handleErrorResponse(e, toastTime, allToast) {
    if (allToast) {
      await this.helper.presentNewToast(((e.name === 'HttpErrorResponse') ? VARS.ON_HTTP_CONNECTION_LOST : e.error.message), toastTime, 'bottom');
      this.helper.dismissLoading();
    }
    return (e);
  }
  public postApiProgress(url, data = null, showToast = false, toastTime = '1000', showAllToast = true, toastPos = 'bottom', specialCheck = false) {
    return new Promise(resolve => {
      const uploadReq = new HttpRequest('POST', apiUrl + url, data, {
        reportProgress: true,
      });
      this.http.request(uploadReq).subscribe( (event: HttpEvent<any>)  => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.httpEventListener.next(event);
            break;
          case HttpEventType.ResponseHeader:
            this.httpEventListener.next(event);
            break;
          case HttpEventType.UploadProgress:
            this.httpEventListener.next(event);
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`Posting in progress! ${percentDone}% \n
            Bytes being upload: ${event.loaded} \n
            Total no. of bytes to upload: ${event.total}`);
            break;
          case HttpEventType.Response:
            this.httpEventListener.next(event);
            const res = event.body;
            return resolve(res);
            /*if (res.status && (res.code === 200 || res.code === 202 || res.code === 203 )) {
              if (showToast && showAllToast) { this.helper.presentNewToast(res.message, toastTime, toastPos).catch(() => {}); }
              return resolve(res);
            } else {
              this.helper.requestHandlerResponse(res, toastTime, showAllToast, toastPos, specialCheck).catch(() => {});
              return resolve(res);
            }*/
        }
      }, async e => {
        return resolve(this.handleErrorResponse(e, toastTime, showAllToast));
      });
    });
  }
  getFields(key, value = null, reverse = false) {
    return new Promise(resolve => {
      if (key === 'timeframe' && !value) {
        value = 9065;
      } else if (key === 'notifications' || key === 'messages') {
        value = 'user_' + value;
      }
      this.apiCall(PURPOSE.GET_FIELD, {key, value}, false, false).then((res: any) => {
        if (ApiService._successRes(res)) {
          return resolve(reverse ? _.reverse(res.data) : res.data);
        }
      }).catch(() => {});
    });
  }
  getNotification(id = null, reverse = false) {
    return new Promise(resolve => {
      this.auth.getSavedUser().then((user) => {
        if (user) {
          const userId = StaticService.getUser(user, STORAGE_GET_DATA.USER_ID);
          this.apiCall(PURPOSE.GET_NOTIFICATIONS, {id, current_user_id: userId}, false, false).then((res: any) => {
            if (ApiService._successRes(res) && res.data.notification_details && res.data.notification_details.length) {
              return resolve(reverse ? _.reverse(res.data.notification_details) : res.data.notification_details);
            } else {
              return resolve([]);
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    });
  }
  clearNotification(quote = null) {
    this.auth.getSavedUser().then((user) => {
      if (user) {
        const userId = StaticService.getUser(user, STORAGE_GET_DATA.USER_ID);
        if (_.includes([APP_PAGES.DETAIL_QUOTE], this.router.url)) {
          this.apiCall(PURPOSE.CLEAR_NOTIFICATIONS, {quote, user_id: userId}, false, false).catch(() => {});
        } else {
          this.navCtrl.navigateForward(APP_PAGES.DETAIL_QUOTE, {
            state: { pId: quote, user }
          }).then(() => {
            this.apiCall(PURPOSE.CLEAR_NOTIFICATIONS, {quote, user_id: userId}, false, false).catch(() => {});
          }).catch(() => {});
        }
      }
    }).catch(() => {});
  }
  getMessages(id = null, reverse = false) {
    return new Promise(resolve => {
      this.auth.getSavedUser().then((user) => {
        if (user) {
          const userId = StaticService.getUser(user, STORAGE_GET_DATA.USER_ID);
          this.apiCall(PURPOSE.GET_MESSAGES, {id, user_id: userId}, false, false).then((res: any) => {
            if (ApiService._successRes(res) && res.data.messages && res.data.messages.length) {
              return resolve(reverse ? _.reverse(res.data.messages) : res.data.messages);
            } else {
              return resolve([]);
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    });
  }
  clearMessages(quote = null, userIds = null) {
    this.auth.getSavedUser().then((user) => {
      if (user) {
        const userId = userIds ? userIds : StaticService.getUser(user, STORAGE_GET_DATA.USER_ID);
        if (_.includes([APP_PAGES.DETAIL_QUOTE], this.router.url)) {
          this.apiCall(PURPOSE.CLEAR_MESSAGES, {quote, user_id: userId}, false, false).catch(() => {});
        } else {
          this.navCtrl.navigateForward(APP_PAGES.DETAIL_QUOTE, {
            state: { pId: quote, user }
          }).then(() => {
            this.apiCall(PURPOSE.CLEAR_MESSAGES, {quote, user_id: userId}, false, false).catch(() => {});
          }).catch(() => {});
        }
      }
    }).catch(() => {});
  }
}
