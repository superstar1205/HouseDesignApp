import {Component, ElementRef} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {IMGS, PURPOSE, STORAGE_GET_DATA, USER_TYPES, VALIDATION_MSG, VARS, FILE_VAR, USER_ACCOUNT_TYPE_REG} from '../../app-constants.service';
import {NavController} from '@ionic/angular';
import {INPUT_TYPE_NAME} from '../../keyOf';
import {FunService} from '../../Services/fun/fun.service';
import {StaticService} from '../../Services/static/static.service';
import {ApiService} from '../../Services/api/api.service';
import {UploaderService} from '../../Services/uploader/uploader.service';
import _ from 'lodash';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage {
  _UT = USER_TYPES; _AT: any = _.toArray(USER_ACCOUNT_TYPE_REG);
  loadingUser = true; _USER: any; user: any; userType: any; personal: any; company: any;
  _SEGMENTS: any = []; currentSegment = 'Personal';
  personalForm: any; personalFormC: any;
  securityForm: any; securityFormC: any;
  companySettingForm: any; companySettingFormC: any;
  tempFileArr: any = []; tempFilesToUp: any = []; tempErrorFileSelect = null;
  tempFileArr2: any = []; tempFilesToUp2: any = []; tempErrorFileSelect2 = null;
  cForm: any; cFormC: any; purpose: any; tempimg: any; tempimg2: any; UData: any;
  _SERVICES_ARR: any = [];
  constructor(private storage: Storage,
              public auth: AuthService,
              public helper: HelperService,
              public fun: FunService,
              private api: ApiService,
              public navCtrl: NavController,
              private el: ElementRef,
              private uploader: UploaderService) {
    this.auth.authState$.subscribe(state => {
      if (state === true) {
        this.auth.getSavedUser().then((user) => {
          this._USER = user;
          this.user = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER);
          this.userType = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ROLE);
          if (this.userType === USER_TYPES.CLIENT || this.userType === USER_TYPES.SUPPLIER) {
            this._SEGMENTS = [
              {id: 0, val: 'Personal', iconName: 'md-person', srcName: ''},
              {id: 3, val: 'Security', iconName: '', srcName: IMGS.SHIELD2},
            ];
          } else if (this.userType === USER_TYPES.CONTRACTOR) {
            this._SEGMENTS = [
              {id: 0, val: 'Personal', iconName: 'md-person', srcName: ''},
              {id: 1, val: 'Upload', iconName: '', srcName: IMGS.CLOUD_BACKUP_UP_ARROW},
              {id: 3, val: 'Security', iconName: '', srcName: IMGS.SHIELD2},
              // {id: 4, val: 'Schedule', iconName: '', srcName: IMGS.CALENDAR2},
            ];
          } else {
            // AGENT, HEAD_CONTRACTOR
            this._SEGMENTS = [
              {id: 0, val: 'Personal', iconName: 'md-person', srcName: ''},
              {id: 2, val: 'CompanySettings', iconName: 'md-settings', srcName: ''},
              {id: 3, val: 'Security', iconName: '', srcName: IMGS.SHIELD2},
              // {id: 4, val: 'Schedule', iconName: '', srcName: IMGS.CALENDAR2},
            ];
          }
          if (this.currentSegment === 'Personal') {
            this.personalForm = StaticService.getPersonalForm();
            this.personalFormC = this.personalForm.controls;
            StaticService.onChangeUserRole(this.personalFormC, this.userType);
          }
          this.companySettingForm = StaticService.getSettingsForm(); this.companySettingFormC = this.companySettingForm.controls;
          this.securityForm = StaticService.getSecurityForm(); this.securityFormC = this.securityForm.controls;
          this.loadingUser = false;
          this.getServiceList();
        });
      } else {
        this._USER = this.user = this.userType = null;
        this.loadingUser = false;
      }
    });
  }
  ionViewDidEnter() {
    this.getDetails();
  }
  setValFormOnChangeSeg(currentSegment) {
    // console.log('cc', currentSegment, this.company);
    // if (currentSegment === 'CompanySettings') {
    if (this.company.name) {
      StaticService.setFormVal(this.companySettingFormC, 'company_name', this.company.name);
    }
    if (this.company.email) {
      StaticService.setFormVal(this.companySettingFormC, 'company_email', this.company.email);
    }
    if (this.company.phone) {
      StaticService.setFormVal(this.companySettingFormC, 'company_phone', this.company.phone);
    }
    if (this.company.address) {
      StaticService.setFormVal(this.companySettingFormC, 'company_address', this.company.address);
    }
    if (this.company.terms) {
      StaticService.setFormVal(this.companySettingFormC, 'ipi', this.company.terms);
    }
    if (this.userType === this._UT.AGENT && this.company.quote_validity) {
      StaticService.setFormVal(this.companySettingFormC, 'quote_validity', this.company.quote_validity);
    }
    // }
  }
  getDetails() {
    this.auth.authState$.subscribe(state => {
      if (state === true) {
        this.auth.getSavedUser().then((user) => {
          if (user) {
            this._USER = user;
            this.user = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER);
            this.api.apiCall(PURPOSE.GET_ACCOUNT_DETAILS, {
              current_user_id: StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ID)
            }).then((res: any) => {
              if (ApiService._successRes(res)) {
                this.UData = res.data;
                this.personal = res.data.personal;
                this.tempimg = this.personal.profile_img;
                StaticService.setFormVal(this.personalFormC, 'first_name', this.personal.first_name);
                StaticService.setFormVal(this.personalFormC, 'last_name', this.personal.last_name);
                StaticService.setFormVal(this.personalFormC, 'email', this.personal.email);
                StaticService.setFormVal(this.personalFormC, 'phone', this.personal.phone);
                StaticService.setFormVal(this.personalFormC, 'address', this.personal.address);
                StaticService.setFormVal(this.personalFormC, 'business_name', this.personal.business_name);
                StaticService.setFormVal(this.personalFormC, 'service_seeking', this.personal.service_seeking);
                StaticService.setFormVal(this.personalFormC, 'facebook_page', this.personal.licence_no);
                StaticService.setFormVal(this.personalFormC, 'trade', this.personal.ABN);
                // StaticService.setFormVal(this.personalFormC, 'trade', this.personal.trade);
                StaticService.setFormVal(this.personalFormC, 'hi_pages', this.personal.trade);
                StaticService.setFormVal(this.personalFormC, 'areas_serviced', this.personal.area_service);
                StaticService.setFormVal(this.personalFormC, 'radius', this.personal.radius);
                StaticService.setFormVal(this.personalFormC, 'services', true);
                this.company = res.data.company_settings;
                this.tempimg2 = this.company.logo.logo;
              }
              this.loadingUser = false;
              StaticService.markFormGroupUnTouched(this.personalFormC);
              StaticService.markFormGroupUnTouched(this.companySettingFormC);
              StaticService.markFormGroupUnTouched(this.securityFormC);
            }).catch(() => {});
          } else {
            this.loadingUser = false;
          }
        });
      } else {
        this._USER = this.user = this.userType = null;
        this.loadingUser = false;
      }
    });
  }
  vCheck(fieldName, type: INPUT_TYPE_NAME, options: any = {}) {
    options.isRequired = true;
    const cFormC = (this.currentSegment === 'Personal') ? this.personalFormC : (this.currentSegment === 'CompanySettings') ? this.companySettingFormC : (this.currentSegment === 'Security') ? this.securityFormC : this.personalForm; // TODO
    if (cFormC) { return StaticService.formError(cFormC, fieldName, type, options).msg; }
  }
  submitForm(type = null) {
    const userId = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ID);
    const userType = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ROLE);
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (type === 'personal') {
      if (this.personalForm.valid) {
        this.helper.presentLoadingWithOptions('Saving data...').catch(() => {});
        const formData = new FormData();
        _.forEach([this.personalForm.value][0], (value, key) => {
          formData.append(key, value);
        });
        if (this.tempFilesToUp.length) {
          formData.append('photo', this.tempFilesToUp[0].imgBlobs, this.tempFilesToUp[0].myFile.name);
        }
        formData.append('current_user_id', userId);
        formData.append('user_type', userType);
        this.api.apiCall(PURPOSE.SAVE_ACCOUNT_PERSONAL_DETAILS, formData, true, true, '2000', 'bottom', false).then((res: any) => {
          if (ApiService._successRes(res)) {
            this.getDetails();
            // also saveData in storage
            this.storage.get(VARS.SG_HOUSEACE_USER_KEY).then(valueStr => {
              const value = valueStr.metadata;
              // Modify just that property
              valueStr.metadata.first_name = this.personalForm.value.first_name;
              valueStr.metadata.last_name = this.personalForm.value.last_name;
              valueStr.metadata.phone = this.personalForm.value.phone;
              valueStr.metadata.address = this.personalForm.value.address;
              valueStr.user.email = this.personalForm.value.email;
              valueStr.user.displayname = this.personalForm.value.first_name + ' ' + this.personalForm.value.last_name;
              valueStr.user.firstname = this.personalForm.value.first_name;
              valueStr.user.lastname = this.personalForm.value.last_name;
              // Save the entire data again
              this.storage.set(VARS.SG_HOUSEACE_USER_KEY, valueStr);
              // console.log('after', valueStr, value);
            });
          }
          this.helper.dismissLoading();
        }).catch(() => {});
      } else { StaticService.markFormGroupTouched(this.personalForm, invalidElements); }
    } else if (type === 'companySetting') {
      if (this.companySettingForm.valid) {
        this.helper.presentLoadingWithOptions('Saving data...').catch(() => {});
        const formData = new FormData();
        _.forEach([this.companySettingForm.value][0], (value, key) => {
          formData.append(key, value);
        });
        if (this.tempFilesToUp2[0]) {
          formData.append('photo', this.tempFilesToUp2[0].imgBlobs, this.tempFilesToUp2[0].myFile.name);
        }
        formData.append('address', this.companySettingForm.value.company_address);
        formData.append('tax_name', this.company.tax_name);
        formData.append('tax_value', this.company.tax_value);
        formData.append('current_user_id', userId);
        formData.append('user_type', userType);
        this.api.apiCall(PURPOSE.SAVE_ACCOUNT_COMPANY_SETTINGS, formData, true, true, '2000', 'bottom', false).then((res: any) => {
          if (ApiService._successRes(res)) {
            this.getDetails();
            this.storage.get(VARS.SG_HOUSEACE_USER_KEY).then(valueStr => {
              const value = valueStr.metadata;
              // Modify just that property
              valueStr.metadata.invCompany_name = this.companySettingForm.value.company_name;
              valueStr.metadata.invAddress = this.companySettingForm.value.company_address;
              valueStr.metadata.invEmail = this.companySettingForm.value.company_email;
              valueStr.metadata.invPhone = this.companySettingForm.value.company_phone;
              valueStr.metadata.invTax_name = this.company.tax_name;
              valueStr.metadata.invTax_value = this.company.tax_value;
              valueStr.metadata.invIpi = this.companySettingForm.value.ipi;
              if (this.userType === this._UT.AGENT) {
                valueStr.metadata.invquote_validity = this.companySettingForm.value.quote_validity;
              }
              // Save the entire data again
              this.storage.set(VARS.SG_HOUSEACE_USER_KEY, valueStr);
              // console.log('after', valueStr, value);
            });
          }
          this.helper.dismissLoading();
        }).catch(() => {});
      } else {
        StaticService.markFormGroupTouched(this.companySettingForm, invalidElements);
      }
    } else if (type === 'security') {
      if (this.securityForm.valid) {
        const formData = new FormData();
        _.forEach([this.securityForm.value][0], (value, key) => {
          formData.append(key, value);
        });
        formData.append('current_user_id', userId);
        formData.append('user_type', userType);
        this.api.apiCall(PURPOSE.SAVE_ACCOUNT_SECURITY_SETTINGS, formData, true, true, '2000', 'bottom', false).then((res: any) => {
          if (ApiService._successRes(res)) {
            this.getDetails();
          }
          this.helper.dismissLoading();
        }).catch(() => {});
      } else {
        StaticService.markFormGroupTouched(this.securityForm, invalidElements);
      }
    }
  }

  addNewFile() {
    this.uploader.uploadFile('', false, {
      acceptFiles: FILE_VAR.IMG_FILE_TYPE,
      maxFileSize: FILE_VAR.MAX_FILE_SIZE_DEFAULT
    }, 1, 'Upload Photo').then((selectedFiles: any) => {
      if (selectedFiles && _.isArray(selectedFiles) && selectedFiles.length) {
        this.tempErrorFileSelect = null;
        if (!this.tempFilesToUp) {
          this.tempFilesToUp = [];
        }
        _.forEach(selectedFiles, img => {
          this.tempFileArr.push({id: (this.tempFileArr.length + 1), url: img.readFileSrc, fileType: img.myFile.type });
          this.tempFileArr = _.reverse(this.tempFileArr);
          this.tempFilesToUp.push(img);
          this.tempFilesToUp = _.reverse(this.tempFilesToUp);
        });
        this.tempimg = this.tempFilesToUp[0].readFileSrc;
      }
    }).catch(() => {});
  }
  addNewFile2() {
    this.uploader.uploadFile('', false, {
      acceptFiles: FILE_VAR.IMG_FILE_TYPE,
      maxFileSize: FILE_VAR.MAX_FILE_SIZE_DEFAULT
    }, 1, 'Upload Photo').then((selectedFiles: any) => {
      if (selectedFiles && _.isArray(selectedFiles) && selectedFiles.length) {
        this.tempErrorFileSelect2 = null;
        if (!this.tempFilesToUp2) {
          this.tempFilesToUp2 = [];
        }
        _.forEach(selectedFiles, img => {
          this.tempFileArr2.push({id: (this.tempFileArr2.length + 1), url: img.readFileSrc, fileType: img.myFile.type });
          this.tempFileArr2 = _.reverse(this.tempFileArr2);
          this.tempFilesToUp2.push(img);
          this.tempFilesToUp2 = _.reverse(this.tempFilesToUp2);
        });
        this.tempimg2 = this.tempFilesToUp2[0].readFileSrc;
      }
    }).catch(() => {});
  }
  onDeleteFile(e, Ptype = null) {
    const evData = e.data;
    this.helper.presentAlertConfirm('Confirm!', 'Are you sure you want to remove this file?', 'Yes, please!', 'No').then(isConfirm => {
      if (isConfirm) {
        this.helper.presentLoadingWithOptions().catch(() => {});
        const userId = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ID);
        const formData = new FormData();
        formData.append('current_user_id', userId);
        formData.append('type', Ptype);
        formData.append('image_id', evData.img.remove_id);
        this.api.apiCall(PURPOSE.REMOVE_UPLOADS, formData, true, true, '2000', 'bottom', false).then((res: any) => {
          if (ApiService._successRes(res)) {
            this.getDetails();
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }
  uploadFilePhoto(type, data = null) {
    this.uploader.uploadFile(FILE_VAR.SUB_HEADER1, true, {
      acceptFiles: FILE_VAR.ALLOWED_FILE_TYPE,
      maxFileSize: FILE_VAR.MAX_FILE_SIZE_DEFAULT
    }).then((files: any) => {
      this.uploadDoc(files, type, data);
    }).catch(() => {});
  }
  uploadDoc(files, type = 'Licence', row = null) {
    if (files.length) {
      this.helper.presentLoadingWithOptions().catch(() => {});
      const userId = StaticService.getUser(this._USER, STORAGE_GET_DATA.USER_ID);
      const formData = new FormData();
      formData.append('current_user_id', userId);
      formData.append('type', type);
      _.forEach(files, file => {
        formData.append('file[]', file.imgBlobs, file.myFile.name);
      });

      this.api.apiCall(PURPOSE.UPLOAD_LICENCE_OR_INSURANCE_DOCUMENT, formData, true, true, '2000', 'bottom', false).then((res: any) => {
        if (ApiService._successRes(res)) {
          this.getDetails();
        }
      }).catch(() => {});
    }
  }

  getServiceList() {
    this.api.apiCall(PURPOSE.GET_SERVICES, {}, false, false).then((res: any) => {
      if (ApiService._successRes(res)) {
        this._SERVICES_ARR = res.data;
      }
    }).catch(() => {});
  }
}
