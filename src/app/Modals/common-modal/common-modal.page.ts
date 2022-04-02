import {Component, ElementRef, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {ApiService} from '../../Services/api/api.service';
import {NOTIFICATION_TYPES, PURPOSE, VALIDATION_MSG, VARS} from '../../app-constants.service';
import {HelperService} from '../../Services/Helper/helper.service';
import {INPUT_TYPE_NAME} from '../../keyOf';
import {StaticService} from '../../Services/static/static.service';
import _ from 'lodash';
import {UploaderService} from '../../Services/uploader/uploader.service';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.page.html',
  styleUrls: ['./common-modal.page.scss'],
})
export class CommonModalPage implements OnInit {
  _NT = _.toArray(NOTIFICATION_TYPES);
  headFull = true; modalType: any; headerTitle: any; cMData: any;
  cModalForm: any; cModalFormC: any; showFootBtn = 0; footBtnTxt = 'Save';
  tempFileArr: any = []; tempFilesToUp: any = []; tempErrorFileSelect = null;
  otherData: any; filterList: any = []; searchTxt: any = '';
  constructor(private modalCtrl: ModalController,
              private navParams: NavParams,
              private api: ApiService,
              private el: ElementRef,
              public helper: HelperService,
              private uploader: UploaderService) {
    this.headerTitle = navParams.get('headerTitle') || null;
    this.modalType = navParams.get('mType') || null;
    this.cMData = navParams.get('sData') || null;
    switch (this.modalType) {
      case 'notifications': {
        const id = (this.cMData && this.cMData.id) ? this.cMData.id : null;
        this.cMData = (this.cMData && this.cMData.notifications) ? this.cMData.notifications : this.cMData;
        // this.api.clearNotification(id);
        break;
      }
      case 'messages': {
        const id = (this.cMData && this.cMData.id) ? this.cMData.id : null;
        this.cMData = (this.cMData && this.cMData.messages) ? this.cMData.messages : this.cMData;
        // this.api.clearMessages(id);
        break;
      }
      case 'searchQuotes': {
        this.showFootBtn = 1; this.footBtnTxt = 'Search';
        break;
      }
      case 'addNewClient': {
        this.cModalForm = StaticService.getStepRegisterForm();
        this.showFootBtn = 1; this.footBtnTxt = 'Create';
        break;
      }
      case 'manageProjectActions': {
        this.cModalForm = (this.cMData.action === 'change_status') ? StaticService.getThisInputExtraForm() : StaticService.getThisInputForm();
        StaticService.setFormVal(this.cModalForm.controls, 'this_input', (this.cMData.action === 'start_date' && this.cMData.inputValue) ? StaticService.toDateTime(this.cMData.inputValue) : this.cMData.inputValue);
        if (this.cMData.action === 'change_status') {
          StaticService.setFormVal(this.cModalForm.controls, 'input_extra', this.cMData.inputValueBefore);
        }
        this.showFootBtn = 1; this.footBtnTxt = 'Save';
        break;
      }
      case 'addProjectComment': {
        this.cModalForm = StaticService.getThisInputForm();
        this.showFootBtn = 1; this.footBtnTxt = this.cMData.saveBtnText;
        break;
      }
      case 'manageSchedules': {
        break;
      }
      case 'manageVariations': {
        break;
      }
      case 'adjustMilestone': {
        this.cModalForm = StaticService.getMilestoneForm();
        this.showFootBtn = 2; this.footBtnTxt = this.cMData.saveBtnText;
        break;
      }
      case 'addPeople': {
        this.cMData.selectedUser = 0;
        this.filterList = this.cMData.udata;
        this.showFootBtn = 1; this.footBtnTxt = 'Save';
        if (this.cMData && this.cMData.uType === 'contractor') {
          this.cModalForm = StaticService.getThisInputForm();
          this.cModalForm.controls.this_input.setValidators([Validators.pattern(VARS.NUMERIC_DECIMAL_PATTERN), Validators.min(0)]);
          this.cModalForm.controls.this_input.updateValueAndValidity();
          const totalPrice = _.toNumber(this.cMData.project_total);
          const contPrice = _.round(0.70 * totalPrice);
          StaticService.setFormVal(this.cModalForm.controls, 'this_input', contPrice);
        }
        break;
      }
      case 'editContractorPrice': {
        this.cModalForm = StaticService.getThisInputForm();
        this.showFootBtn = 1; this.footBtnTxt = 'Update Price';
        const contPrice = (this.cMData && this.cMData.contractor && this.cMData.contractor.contractor_price) ?  this.cMData.contractor.contractor_price : 0;
        this.cModalForm.controls.this_input.setValidators([Validators.pattern(VARS.NUMERIC_DECIMAL_PATTERN), Validators.min(0)]);
        this.cModalForm.controls.this_input.updateValueAndValidity();
        StaticService.setFormVal(this.cModalForm.controls, 'this_input', contPrice);
        break;
      }
      case 'addNewScope': {
        this.cMData.projectList = [];
        this.cMData.timeframe = [];
        this.cMData.isLoading = true;
        this.api.apiCall(PURPOSE.GET_TEMPLATE, {}, false).then((res: any) => {
          if (ApiService._successRes(res)) {
            this.cMData.projectList = res.data;
            this.cMData.timeframe = res.timeframe;
          }
          this.cMData.isLoading = false;
        }).catch(() => {});
        break;
      }
      default: {
        this.dismissModal();
        break;
      }
    }
    if (this.cModalForm) {
      this.cModalFormC = this.cModalForm.controls;
      if (this.cModalFormC) {
        _.forEach(this.cModalFormC, val => {
          val.markAsUntouched();
        });
      }
    }
  }
  onSave(data = null) {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    switch (this.modalType) {
      case 'notifications': {
        this.api.clearNotification((data.project_id) ? data.project_id : null);
        this.dismissModal(false, this.cMData);
        break;
      }
      case 'messages': {
        this.api.clearMessages((data.project_id) ? data.project_id : null, (data.user_id) ? data.user_id : null);
        this.dismissModal(false, this.cMData);
        break;
      }
      case 'searchQuotes': {
        this.dismissModal(false, this.cMData);
        break;
      }
      case 'addNewClient': {
        if (this.cModalForm.valid) {
          this.helper.presentLoadingWithOptions().catch(() => {});
          this.api.apiCall(PURPOSE.APP_REGISTER, this.cModalForm.value, true).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.dismissModal(false, res);
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        } else {
          StaticService.markFormGroupTouched(this.cModalForm, invalidElements);
        }
        break;
      }
      case 'manageProjectActions': {
        if (this.cModalForm.valid) {
          this.helper.presentLoadingWithOptions().catch(() => {});
          const postData: any = {
            project_id: this.cMData.projectId,
            action_name: this.cMData.action,
            action_value: this.cModalForm.value.this_input
          };
          if (this.cMData.action === 'change_status') {
            postData.action_status_before = this.cModalForm.value.input_extra;
          }
          this.api.apiCall(PURPOSE.MANAGE_TIMEFRAME, postData, true).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.dismissModal(false, res);
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        } else {
          StaticService.markFormGroupTouched(this.cModalForm, invalidElements);
        }
        break;
      }
      case 'addProjectComment': {
        if (this.cModalForm.valid) {
          this.helper.presentLoadingWithOptions().catch(() => {});
          const formData = new FormData();
          formData.append('project_id', this.cMData.projectId);
          formData.append('current_user_id', this.cMData.currentUserId);
          formData.append('message', this.cModalForm.value.this_input);
          _.forEach(this.tempFilesToUp, file => {
            formData.append('file[]', file.imgBlobs, file.myFile.name);
          });
          if (this.cMData.commentData) {
            // in case of reply
            formData.append('message_id', this.cMData.commentData.message_id);
          }
          this.api.apiCall(PURPOSE.ADD_COMMENTS, formData, true, true, '2000', 'bottom', false).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.dismissModal(false, res);
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        } else {
          StaticService.markFormGroupTouched(this.cModalForm, invalidElements);
        }
        break;
      }
      case 'adjustMilestone': {
        if (this.cModalForm.valid) {
          this.helper.presentLoadingWithOptions().catch(() => {});
          const postData = this.cModalForm.value;
          postData.project_id = this.cMData.projectId;
          postData.milestone_id = this.cMData.milestoneData.index;
          this.api.apiCall(PURPOSE.SAVE_PAYMENT_ADJUSTMENT, postData, true).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.dismissModal(false, res);
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        } else {
          StaticService.markFormGroupTouched(this.cModalForm, invalidElements);
        }
        break;
      }
      case 'manageSchedules': {
        if (data && data.status) {
          this.dismissModal(false, data.res);
        }
        break;
      }
      case 'manageVariations': {
        if (data && data.status) {
            this.dismissModal(false, data.res);
        }
        break;
      }
      case 'addPeople': {
        let validateSave = !(this.cMData && this.cMData.uType === 'contractor');
        if (!validateSave) {
          if (this.cModalForm.valid && this.cMData.selectedUser) {
            validateSave = true;
          } else {
            if (this.cModalForm.valid && !this.cMData.selectedUser) {
              this.helper.presentAlert('Please select a user first!');
            }
            StaticService.markFormGroupTouched(this.cModalForm, invalidElements);
          }
        }
        if (validateSave && this.cMData.selectedUser) {
          this.helper.presentLoadingWithOptions().catch(() => {});
          this.api.apiCall(PURPOSE.ADD_PEOPLE, {
            current_user_id: this.cMData.current_user_id,
            project_id: this.cMData.project_id,
            user_type: this.cMData.uType,
            new_user_id: this.cMData.selectedUser,
            contractor_price: (this.cModalForm && this.cModalForm.value.this_input) ? this.cModalForm.value.this_input : 0
          }, true).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.dismissModal(false, res);
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        }
        break;
      }
      case 'editContractorPrice': {
        if (this.cModalForm.valid) {
          this.helper.presentLoadingWithOptions().catch(() => {});
          this.api.apiCall(PURPOSE.ADD_PEOPLE, {
            current_user_id: this.cMData.current_user_id,
            project_id: this.cMData.project_id,
            user_type: this.cMData.uType,
            new_user_id: this.cMData.contractor.ID,
            contractor_price: this.cModalForm.value.this_input
          }, true).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.dismissModal(false, res);
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        } else {
          StaticService.markFormGroupTouched(this.cModalForm, invalidElements);
        }
        break;
      }
      case 'addNewScope': {
        if (data) {
          this.dismissModal();
        }
        break;
      }
      default: {
        break;
      }
    }
  }
  async otherBtn(data = null, other = null) {
    switch (this.modalType) {
      case 'addProjectComment': {
        this.addNewFile();
        break;
      }
      default: {
        break;
      }
    }
  }
  addNewFile() {
    this.uploader.uploadFile().then((selectedFiles: any) => {
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
      }
    }).catch(() => {});
  }
  onTempDeleteFile(e) {
    const type = e.type;
    const evData = e.data; // {imgIndex: imgIndex, img: img}
    if (type === 'delete') {
      this.tempFileArr.splice(evData.imgIndex, 1);
      this.tempFilesToUp.splice(evData.imgIndex, 1);
      if (this.tempFileArr.length) {
        this.tempFileArr = _.reverse(_.sortBy(this.tempFileArr, 'id'));
      } else {
        this.tempErrorFileSelect = VALIDATION_MSG.ERR_REQUIRED_SELECT_FILE;
      }
      if (this.tempFilesToUp.length) {
        this.tempFilesToUp = _.reverse(_.sortBy(this.tempFilesToUp));
      } else {
        this.tempErrorFileSelect = VALIDATION_MSG.ERR_REQUIRED_SELECT_FILE;
      }
    }
  }
  ngOnInit() {
  }
  dismissModal(isC = true, resData = null) {
    if (this.cMData && this.cMData.alwaysReturn) {
      isC = false;
      resData = resData || 'Always true';
    }
    this.modalCtrl.dismiss({
      isCancel: isC,
      responseData: resData
    }).catch(() => {});
  }
  vCheck(fieldName, type: INPUT_TYPE_NAME = 'OTHER', options: any = {}) {
    options.isRequired = true;
    if (this.cModalFormC) { return StaticService.formError(this.cModalFormC, fieldName, type, options).msg; }
  }
  onAddPeopele(newUserId) {
    this.helper.presentLoadingWithOptions().catch(() => {});
    this.api.apiCall(PURPOSE.ADD_PEOPLE, {
        current_user_id: this.cMData.current_user_id,
        project_id: this.cMData.project_id,
        user_type: this.cMData.uType,
        new_user_id: newUserId
    }, true).then((res: any) => {
        if (ApiService._successRes(res)) {
            this.dismissModal(false, res);
        }
        this.helper.dismissLoading();
    }).catch(() => {});
  }
  setFilterItems() {
    this.filterList = this.cMData.udata;
    if (this.searchTxt.length) {
      this.filterList = this.filterItems(this.searchTxt);
    }
  }

  filterItems(searchTerm) {
    return this.filterList.filter(item => {
      return (item.first_name + ' ' + item.last_name + ' (' + item.user_email + ')').toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
