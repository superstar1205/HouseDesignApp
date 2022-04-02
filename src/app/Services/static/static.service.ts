import { Injectable } from '@angular/core';
import {INPUT_TYPE_NAME} from '../../keyOf';
import {STORAGE_GET_DATA, USER_ACCOUNT_TYPE_REG, USER_TYPES, USER_TYPES_REG, VALIDATION_MSG, VARS} from '../../app-constants.service';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import _ from 'lodash';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  constructor() {
  }
  static getMyDate(type, format = null, date = null) {
    if (type === 1) { // date with timezone
      return format ? momentTz.tz(moment(date).toDate(), VARS.APP_TIMEZONE).format(format) : momentTz.tz(moment(date).toDate(), VARS.APP_TIMEZONE);
    } else if (type === 2) { // date without timezone (i.e default timezone)
      return format ? moment(date).format(format) : moment(date).toDate();
    }
  }
  static formError(formControl, fieldName, type: INPUT_TYPE_NAME = 'OTHER', opts: any = null) {
    const options: any = {};
    options.isRequired          = !!(opts && opts.isRequired);
    options.equal               = (opts && opts.equal) ? opts.equal : null;
    options.min                 = (opts && opts.min) ? opts.min : 0;
    options.max                 = (opts && opts.max) ? opts.max : 1;
    options.minLength           = (opts && opts.minLength) ? opts.minLength : 0;
    options.maxLength           = (opts && opts.maxLength) ? opts.maxLength : 1;
    options.passwordEqualField  = (opts && opts.passwordEqualField) ? opts.passwordEqualField : 'password';
    const validationResponse = { msg: null, data: [] };
    if (formControl[fieldName].touched) {
      switch (type) {
        case '_EMAIL': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('pattern')) {
            validationResponse.msg = VALIDATION_MSG.ERR_EMAIL_PATTERN;
          }
          break;
        }
        case '_PASSWORD': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('minlength')) {
            validationResponse.msg = VALIDATION_MSG.ERR_PASS_MIN_LENGTH;
          }
          break;
        }
        case '_INPUT': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          break;
        }
        case '_SELECT': {
          if (formControl[fieldName].hasError('required')) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_SELECT;
          }
          break;
        }
        case '_MULTIPLE_SELECT': {
          if (formControl[fieldName].hasError('required') || !formControl[fieldName].value || !formControl[fieldName].value.length) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_SELECT;
          }
          break;
        }
        case '_EQUAL': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('equalTo') || formControl[options.passwordEqualField].value !== formControl[fieldName].value) {
            validationResponse.msg = VALIDATION_MSG.ERR_FIELD_NOT_MATCH;
          }
          break;
        }
        case '_MINLENGTH_MAXLENGTH_SAME': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('minlength') || formControl[fieldName].hasError('maxlength')) {
            validationResponse.msg = (options && options.minLength && options.maxLength) ? '*Enter ' + options.minLength + 'digit only.' : VALIDATION_MSG.ERR_LENGTH_NOT_MATCH;
          }
          break;
        }
        case '_PATTERN_NUM_MIN_MAX': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('pattern')) {
            validationResponse.msg = VALIDATION_MSG.ERR_NUMERIC_ONLY;
          }
          if (formControl[fieldName].hasError('min')) {
            validationResponse.msg = VALIDATION_MSG.ERR_GREATER_OR_EQUAL + options.min;
          }
          if (formControl[fieldName].hasError('max')) {
            validationResponse.msg = VALIDATION_MSG.ERR_LESS_OR_EQUAL + options.max;
          }
          break;
        }
        case '_MAX_CHAR': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('maxlength')) {
            validationResponse.msg = 'Max ' + options.maxLength + 'Character allowed!';
          }
          break;
        }
        case '_MIN_CHAR': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('minlength')) {
            validationResponse.msg = 'Min ' + options.minLength + 'Character required!';
          }
          break;
        }
        case 'PASSWORD': { // not required
          if (formControl[fieldName].hasError('minlength')) {
            validationResponse.msg = VALIDATION_MSG.ERR_PASS_MIN_LENGTH;
          }
          break;
        }
        case 'MINLENGTH_MAXLENGTH_SAME': { // not required
          if (formControl[fieldName].hasError('minlength') || formControl[fieldName].hasError('maxlength')) {
            validationResponse.msg = (options && options.minLength && options.maxLength) ? '*Enter ' + options.minLength + 'digit only.' : VALIDATION_MSG.ERR_LENGTH_NOT_MATCH;
          }
          break;
        }
        case '_CHECK_BOX': {
          if (formControl[fieldName].hasError('required') || !formControl[fieldName].value) {
            validationResponse.msg = VALIDATION_MSG.ERR_TERM_AND_PRIVACY;
          }
          break;
        }
        case 'OTHER': {
          break;
        }
        default: {
          break;
        }
      }
    }
    return validationResponse;
  }
  static markFormGroupTouched(form, invalidElements = [], focusIndex = 1) {
    try {
      form.markAllAsTouched();
    } catch (e) {}
    if (invalidElements && invalidElements.length > focusIndex) {
      try {
        invalidElements[focusIndex].setFocus();
      } catch (e) {}
    }
  }
  static markFormGroupUnTouched(formC) {
    _.forEach(formC, val => {
      try {
        val.markAsUntouched();
      } catch (e) {}
    });
  }
  static myCustomValidator(fieldNameOrVal, valType = 'equalTo'): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const input = control.value;
      const isValid = (valType === 'equalTo') ? (control.root.value[fieldNameOrVal] === input) : (valType === 'greaterThan') ? (input > fieldNameOrVal) : (valType === 'lessThan') ? (input < fieldNameOrVal) : false;
      if (!isValid) {
        return { [valType]: {isValid} };
      } else {
        return null;
      }
    };
  }
  static getLoginForm() {
    return new FormGroup({
      user_login : new FormControl('', [Validators.required]),
      user_password: new FormControl('', [Validators.required])
    });
  }
  static getRegisterForm(ut = true) {
    return new FormGroup({
      user_type       : new FormControl(ut ? USER_TYPES_REG.HOMEOWNERS : '', [Validators.required]),
      user_firstname  : new FormControl('', [Validators.required]),
      user_lastname   : new FormControl('', [Validators.required]),
      user_email      : new FormControl('', [Validators.required, Validators.pattern(VARS.EMAIL_PATTERN)]),
      user_password   : new FormControl('', [Validators.required]),
      user_passwordc  : new FormControl('', [Validators.required, StaticService.myCustomValidator('user_password')]),
      account_type    : new FormControl(USER_ACCOUNT_TYPE_REG.SUPPLIER),
      radius          : new FormControl(''),
      services        : new FormControl(''),
      isAccepted      : new FormControl(false, Validators.required),
    });
  }
  static getForgotPassForm() {
    return new FormGroup({
      user_login : new FormControl('', [Validators.required])
    });
  }
  static getStepLoginForm() {
    return new FormGroup({
      loginEmail : new FormControl('', [Validators.required]),
      loginPassword: new FormControl('', [Validators.required])
    });
  }
  static getStepRegisterForm() {
    return new FormGroup({
      regType               : new FormControl('FINISH_STEPS'),
      user_type             : new FormControl(USER_TYPES_REG.HOMEOWNERS, [Validators.required]),
      registerFirstName     : new FormControl('', [Validators.required]),
      registerLastName      : new FormControl('', [Validators.required]),
      registerAddress       : new FormControl('', [Validators.required]),
      registerPhone         : new FormControl('', [Validators.required]),
      registerEmail         : new FormControl('', [Validators.required, Validators.pattern(VARS.EMAIL_PATTERN)]),
      /*registerPassword      : new FormControl('', [Validators.required]),
      registerPasswordCheck : new FormControl('', [Validators.required, StaticService.myCustomValidator('registerPassword')]),*/
    });
  }
  static getRegisterClientForm() {
    return new FormGroup({
      registerFirstName     : new FormControl('', [Validators.required]),
      registerLastName      : new FormControl('', [Validators.required]),
      registerAddress       : new FormControl('', [Validators.required]),
      registerPhone         : new FormControl('', [Validators.required]),
      registerEmail         : new FormControl('', [Validators.required, Validators.pattern(VARS.EMAIL_PATTERN)]),
    });
  }
  static getQuotesForm(userType) {
    let formGroup: any;
    switch (userType) {
      case USER_TYPES.CLIENT: {
        formGroup = new FormGroup({
          projectTimeframe: new FormControl('', [Validators.required]),
          date_start: new FormControl(''),
          projectClient: new FormControl('', [Validators.required])
        });
        break;
      }
      case USER_TYPES.CONTRACTOR: {
        formGroup = new FormGroup({
          projectClient: new FormControl('', [Validators.required])
        });
        break;
      }
      default: {
        formGroup = new FormGroup({
          projectTimeframe: new FormControl('', [Validators.required]),
          date_start: new FormControl('', [Validators.required]),
          projectClient: new FormControl('', [Validators.required])
        });
        break;
      }
    }
    return formGroup;
  }
  static getThisInputForm() {
    return new FormGroup({
      this_input : new FormControl('', [Validators.required]),
    });
  }
  static getThisInputExtraForm() {
    return new FormGroup({
      this_input : new FormControl('', [Validators.required]),
      input_extra : new FormControl(''),
    });
  }
  static getPersonalForm() {
    return new FormGroup({
      first_name     : new FormControl('', [Validators.required]),
      last_name      : new FormControl('', [Validators.required]),
      address        : new FormControl('', [Validators.required]),
      phone          : new FormControl('', [Validators.required]),
      email          : new FormControl('', [Validators.required, Validators.pattern(VARS.EMAIL_PATTERN)]),
      business_name   : new FormControl(''),
      facebook_page   : new FormControl(''),
      hi_pages        : new FormControl(''),
      service_seeking : new FormControl(''),
      trade           : new FormControl(''),
      areas_serviced  : new FormControl(''),
      account_type    : new FormControl(USER_ACCOUNT_TYPE_REG.SUPPLIER),
      radius          : new FormControl(''),
      services        : new FormControl('')
  });
  }
  static getSettingsForm() {
    return new FormGroup({
      company_name     : new FormControl('', [Validators.required]),
      quote_validity   : new FormControl(''),
      company_email    : new FormControl('', [Validators.required, Validators.pattern(VARS.EMAIL_PATTERN)]),
      company_address  : new FormControl('', [Validators.required]),
      company_phone    : new FormControl('', [Validators.required]),
      ipi              : new FormControl('', [Validators.required]),
    });
  }
  static getSecurityForm() {
    return new FormGroup({
      password   : new FormControl('', [Validators.required]),
      passwordc  : new FormControl('', [Validators.required, StaticService.myCustomValidator('password')])
    });
  }
  static getScheduleForm() {
    return new FormGroup({
      title : new FormControl('', [Validators.required]),
      date_from : new FormControl('', [Validators.required]),
      date_to : new FormControl('', [Validators.required]),
      description : new FormControl('')
    });
  }
  static getMilestoneForm() {
    return new FormGroup({
      title : new FormControl('', [Validators.required]),
      price : new FormControl('', [Validators.required]),
      description : new FormControl('')
    });
  }
  static getReviewForm() {
    return new FormGroup({
      review : new FormControl('', [Validators.required]),
    });
  }
  static addNewFormControl(form, key, value) {
    form.addControl(key, new FormControl(value));
  }
  static getUser(user, resType: STORAGE_GET_DATA = null) {
    let response = null;
    if (user && resType === STORAGE_GET_DATA.METADATA) {
      try { response = user.metadata; } catch (e) {}
    } else if (user && resType === STORAGE_GET_DATA.USER) {
      try { response = user.user; } catch (e) {}
    } else if (user && resType === STORAGE_GET_DATA.USER_CAPABILITIES) {
      try { response = user.userCapabilities; } catch (e) {}
    } else if (user && resType === STORAGE_GET_DATA.COOKIE) {
      try { response = user.cookie; } catch (e) {}
    } else if (user && resType === STORAGE_GET_DATA.USER_ID) {
      try { response = user.userId; } catch (e) {}
    } else if (user && resType === STORAGE_GET_DATA.USER_ROLE) {
      try { response = user.user_role; } catch (e) {}
    } else {
      response = user;
    }
    return response;
  }
  static getEveTrigger(e, type) {
    const response: any = {};
    if (e) {
      if (type === 'sort') {
        response.sortColumn = e.cCurrentSort.sort_column;
        response.sortBy = e.cCurrentSort.sort_by;
      } else if (type === 'filter') {
        response.filterByStatus = e.cCurrentFilter;
      } else if (type === 'search') {
        response.searchText = e.searchText;
      } else if (type === 'searchModal') {
        response.searchByClient = e.searchByClient;
        response.searchByTitle = e.searchByTitle;
      }
    }
    return response;
  }
  static setFormVal(formC, key, value) {
    try {
      formC[key].setValue(value);
      formC[key].markAsTouched();
    } catch (e) {}
  }
  static getFilterList(list, terms, searchTerm) {
    if (_.toString(searchTerm).length) {
      return list.filter(item => {
        const tempStr = [];
        _.forEach(terms, v => { tempStr.push(item[v]); });
        const searchedText = _.join(tempStr, ' ');
        return searchedText.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      return list;
    }
  }
  static userTypeHA(userType) {
    return (userType === USER_TYPES.HEAD_CONTRACTOR || userType === USER_TYPES.AGENT);
  }
  static userTypeHAS(userType) {
    return (userType === USER_TYPES.HEAD_CONTRACTOR || userType === USER_TYPES.AGENT || userType === USER_TYPES.SUPPLIER);
  }
  static userTypeCC(userType) {
    return (userType === USER_TYPES.CONTRACTOR || userType === USER_TYPES.CLIENT);
  }
  static toDateTime(inputDate) {
    if (inputDate) {
      const sD = inputDate.split('/')[0];
      const sM = inputDate.split('/')[1];
      const sY = inputDate.split('/')[2];
      return sY + '/' + sM + '/' + sD;
    } else {
      return null;
    }
  }
  static onChangeUserRole(formC, uType) {
    try {
      if (uType.value === USER_TYPES_REG.TRADESPEOPLE) {
        formC.radius.setValidators(Validators.required);
        formC.radius.updateValueAndValidity();
        formC.services.setValidators(Validators.required);
        formC.services.updateValueAndValidity();
        formC.account_type.clearValidators();
        formC.account_type.updateValueAndValidity();
      } else if (uType.value === USER_TYPES_REG.PARTNERS) {
        formC.account_type.setValidators(Validators.required);
        formC.account_type.updateValueAndValidity();
        formC.radius.setValue('');
        formC.radius.clearValidators();
        formC.radius.updateValueAndValidity();
        formC.services.setValue('');
        formC.services.clearValidators();
        formC.services.updateValueAndValidity();
      } else {
        formC.account_type.clearValidators();
        formC.account_type.updateValueAndValidity();
        formC.radius.setValue('');
        formC.radius.clearValidators();
        formC.radius.updateValueAndValidity();
        formC.services.setValue('');
        formC.services.clearValidators();
        formC.services.updateValueAndValidity();
      }
    } catch (e) {
    }
  }
}
