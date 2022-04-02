import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {INPUT_TYPE_NAME} from '../../keyOf';
import {PURPOSE, USER_ACCOUNT_TYPE_REG, USER_TYPES_REG, USER_TYPES_REG_TITLE} from '../../app-constants.service';
import _ from 'lodash';
import {StaticService} from '../../Services/static/static.service';
import {ApiService} from '../../Services/api/api.service';

@Component({
  selector: 'app-tab-login',
  templateUrl: './tab-login.component.html',
  styleUrls: ['./tab-login.component.scss'],
})
export class TabLoginComponent implements OnInit {
  @Input() public cssClassMain = ''; _UTT = USER_TYPES_REG_TITLE;
  _UT: any = _.toArray(USER_TYPES_REG);
  _AT: any = _.toArray(USER_ACCOUNT_TYPE_REG);
  loginView: any;  _SERVICES_ARR: any = []; // TODO
  loginForm: FormGroup; lFormC: any;
  registerForm: FormGroup; rFormC: any;
  forgotPassForm: FormGroup; fFormC: any;
  constructor(private el: ElementRef,
              private api: ApiService) {
    this.loginForm = StaticService.getLoginForm();
    this.registerForm = StaticService.getRegisterForm();
    this.forgotPassForm = StaticService.getForgotPassForm();
    this.lFormC = this.loginForm.controls;
    this.rFormC = this.registerForm.controls;
    this.fFormC = this.forgotPassForm.controls;
    this.getServiceList();
  }
  vCheck(fieldName, type: INPUT_TYPE_NAME, options: any = {}) {
    options.isRequired = true;
    const cFormC = (this.loginView === 'REGISTER') ? this.rFormC : (this.loginView === 'FORGOT_PASSWORD') ? this.fFormC : this.lFormC;
    if (cFormC) { return StaticService.formError(cFormC, fieldName, type, options).msg; }
  }
  ngOnInit() {}
  changeView(view = 'LOGIN') {
    if (view === 'LOGIN') {
      this.loginView = 'LOGIN';
      this.registerForm.reset();
      this.forgotPassForm.reset();
      this.rFormC.user_type.setValue(USER_TYPES_REG.HOMEOWNERS);
    } else if (view === 'REGISTER') {
      this.loginView = 'REGISTER';
      this.loginForm.reset();
      this.forgotPassForm.reset();
    } else if (view === 'FORGOT_PASSWORD') {
      this.loginView = 'FORGOT_PASSWORD';
      this.loginForm.reset();
      this.registerForm.reset();
    }
  }
  submitForm() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    const cForm = (this.loginView === 'REGISTER') ? this.registerForm : (this.loginView === 'FORGOT_PASSWORD') ? this.forgotPassForm : this.loginForm;
    const purpose = (this.loginView === 'REGISTER') ? PURPOSE.APP_REGISTER : (this.loginView === 'FORGOT_PASSWORD') ? PURPOSE.FORGET_PASSWORD : PURPOSE.APP_LOGIN;
    StaticService.markFormGroupTouched(cForm , invalidElements);
    if (cForm.valid) {
      this.api.login(purpose, cForm.value, (purpose === PURPOSE.APP_LOGIN), true).then((status) => {
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
