import {Component, ElementRef, OnInit} from '@angular/core';
import {IMGS, PURPOSE, SITE_URLS, USER_ACCOUNT_TYPE_REG, USER_TYPES_REG, USER_TYPES_REG_TITLE} from '../app-constants.service';
import _ from 'lodash';
import {ApiService} from '../Services/api/api.service';
import {StaticService} from '../Services/static/static.service';
import {INPUT_TYPE_NAME} from '../keyOf';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  img = IMGS; _UTT = USER_TYPES_REG_TITLE; SI = SITE_URLS;
  _UT: any = _.toArray(USER_TYPES_REG);
  _AT: any = _.toArray(USER_ACCOUNT_TYPE_REG);
  loginView: any; _SERVICES_ARR: any = [];
  loginForm = StaticService.getLoginForm(); lFormC: any;
  registerForm = StaticService.getRegisterForm(true); rFormC: any;
  forgotPassForm = StaticService.getForgotPassForm(); fFormC: any;
  constructor(private api: ApiService,
              private el: ElementRef) {
    this.lFormC = this.loginForm.controls;
    this.rFormC = this.registerForm.controls;
    this.fFormC = this.forgotPassForm.controls;
    this.getServiceList();
  }
  ngOnInit() {
  }
  vCheck(fieldName, type: INPUT_TYPE_NAME, options: any = {}) {
    options.isRequired = true;
    const cFormC = (this.loginView === 'REGISTER') ? this.rFormC : (this.loginView === 'FORGOT_PASSWORD') ? this.fFormC : this.lFormC;
    if (cFormC) { return StaticService.formError(cFormC, fieldName, type, options).msg; }
  }
  changeView(view = 'LOGIN') {
    if (view === 'REGISTER') {
      this.loginView = view;
      this.loginForm.reset();
      this.forgotPassForm.reset();
    } else if (view === 'FORGOT_PASSWORD') {
      this.loginView = view;
      this.loginForm.reset();
      this.registerForm.reset();
    } else {
      this.loginView = 'LOGIN';
      this.registerForm.reset();
      this.forgotPassForm.reset();
      this.rFormC.user_type.setValue(USER_TYPES_REG.HOMEOWNERS);
    }
  }
  submitForm() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    const cForm = (this.loginView === 'REGISTER') ? this.registerForm : (this.loginView === 'FORGOT_PASSWORD') ? this.forgotPassForm : this.loginForm;
    const purpose = (this.loginView === 'REGISTER') ? PURPOSE.APP_REGISTER : (this.loginView === 'FORGOT_PASSWORD') ? PURPOSE.FORGET_PASSWORD : PURPOSE.APP_LOGIN;
    StaticService.markFormGroupTouched(cForm , invalidElements);
    if (cForm.valid) {
      this.api.login(purpose, cForm.value, (purpose === PURPOSE.APP_LOGIN || purpose === PURPOSE.APP_REGISTER), true, true).then((status) => {
        if (status) { this.changeView(); }
      }).catch(() => {});
    } else {
      StaticService.markFormGroupTouched(cForm , invalidElements);
    }
  }
  onChangeRole(formC, uType) {
    StaticService.onChangeUserRole(formC, uType);
  }
  getServiceList() {
    this.api.apiCall(PURPOSE.GET_SERVICES, {}, false, false).then((res: any) => {
      if (ApiService._successRes(res)) {
        this._SERVICES_ARR = res.data;
      }
    }).catch(() => {});
  }
}
