import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HelperService} from '../../Services/Helper/helper.service';
import {ApiService} from '../../Services/api/api.service';
import {
  ACF_FC_LAYOUT,
  APP_PAGES,
  IMGS,
  MANAGE_QUOTE_STATUS,
  PURPOSE,
  STORAGE_GET_DATA,
  USER_TYPES,
  VALIDATION_MSG
} from '../../app-constants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../Services/modal/modal.service';
import {StaticService} from '../../Services/static/static.service';
import _ from 'lodash';
import {UploaderService} from '../../Services/uploader/uploader.service';
import {IonContent, NavController} from '@ionic/angular';
import {INPUT_TYPE_NAME} from '../../keyOf';

@Component({
  selector: 'app-detail-quote',
  templateUrl: './detail-quote.page.html',
  styleUrls: ['./detail-quote.page.scss'],
})
export class DetailQuotePage implements OnInit {
  @ViewChild(IonContent, {static: false}) private scrollVanish: IonContent;
  _ = _; AFL = ACF_FC_LAYOUT; _ACTIVITIES: any = []; _MSG: any = []; _UT = USER_TYPES; MQS = MANAGE_QUOTE_STATUS;
  _SEGMENTS: any = []; currentSegment = 'Activity';
  isLoading = true; progressBar = true;
  pId: any = 0; data: any; user: any; userId = 0; userType: any; statusArr: any = [];
  commentForm = StaticService.getThisInputForm(); replyForm = StaticService.getThisInputForm();
  tempFileArr: any = []; tempFilesToUp: any = []; tempErrorFileSelect = null;
  tempFileArrReply: any = []; tempFilesToUpReply: any = []; tempErrorFileSelectReply = null;
  saveReviewForm = StaticService.getReviewForm();
  starArr: any = [{iconName: 'star', className: 'starC'}, {iconName: 'star', className: 'starC'}, {iconName: 'star', className: 'starC'}, {iconName: 'star', className: 'starC'}, {iconName: 'star', className: 'starC'}];
  selectedStar: any = 5; showReviewForm = false;
  paymentTabSeg = [{val: 'PaymentSubTab', title: 'Payments'}, {val: 'otherPaymentSubTab', title: 'Other Payment'}]; cPaymentTab = 'PaymentSubTab';
  msgInterval: any; notInterval: any;
  showTeams=false;
  constructor(private api: ApiService,
              public helper: HelperService,
              private modalService: ModalService,
              private uploader: UploaderService,
              private el: ElementRef) {
    this.helper.navParams().then((routParams: any) => {
      if (routParams) {
        this.pId = routParams.pId;
        this.user = routParams.user;
        this.userId = StaticService.getUser(STORAGE_GET_DATA.USER_ID);
        this.userType = StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ROLE);
        if (this.userType === USER_TYPES.SUPPLIER) {
          this._SEGMENTS = [
            {val: 'Activity', iconName: 'md-chatboxes', srcName: ''},
            {val: 'Project',  iconName: 'md-list-box', srcName: ''},
            {val: 'Schedule', iconName: 'md-calendar', srcName: ''},
          ];
        } else {
          this._SEGMENTS = [
            {val: 'Activity', iconName: 'md-chatboxes', srcName: ''},
            {val: 'Project',  iconName: 'md-list-box', srcName: ''},
            {val: 'Schedule', iconName: 'md-calendar', srcName: ''},
            {val: 'Payments', iconName: '', srcName: IMGS.ATM}
          ];
        }
        this.currentSegment = (routParams.selectedSegment) ? routParams.selectedSegment : this.currentSegment;
        if(this.currentSegment === 'Activity'){
          this.showTeams=true;
        }else{
          this.showTeams=false;
        }
        this.cPaymentTab = (this.userType === USER_TYPES.CONTRACTOR) ? 'otherPaymentSubTab' : this.cPaymentTab;
        this.getActivities();
        this.getMessage();
      }
    }).catch(() => {});
    _.forEach(MANAGE_QUOTE_STATUS, (val, key) => {
      this.statusArr.push({title: key, val});
    });
  }
  ngOnInit() {
    // this.getDetails();
  }
  onChangeSegment(ev) {
    this.currentSegment = ev.detail.value;
    if(this.currentSegment === 'Activity'){
      this.showTeams=true;
    }else{
      this.showTeams=false;
    }
    this.scrollBottom();
  }
  scrollBottom(timeout = 0) {
    if (this.currentSegment === 'Activity') {
      setTimeout(() => {
        this.scrollVanish.scrollToBottom(150);
      }, timeout);
    }
  }
  ionViewWillLeave() {
    try {
      clearInterval(this.msgInterval);
    } catch (e) {}
    try {
      clearInterval(this.notInterval);
    } catch (e) {}
  }
  ionViewWillEnter() {
    this.getDetails();
    this.msgInterval = setInterval(() => {
      this.getMessage();
    }, 10000);
    this.notInterval = setInterval(() => {
      this.getActivities();
    }, 10000);
  }
  doRefresh(event) {
    this.getDetails(event);
  }
  getDetails(ev = null) {
    this.api.apiCall(PURPOSE.GET_PROJECT_DETAILS, {
      project_id: this.pId,
      current_user_id: StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID)
    }).then((res: any) => {
      if (ApiService._successRes(res)) {
        this.data = res.data;
        this.scrollBottom();
      }
      this.isLoading = this.progressBar = false;
      if (ev) {
        ev.target.complete();
      }
    }).catch(() => {});
  }
  async btn(type, data = null, other = null) {
    let modalData: any = {};
    let mType: any = null;
    let modalHead: any = null;
    let modalCssClass: any = null;
    switch (type) {
      case 'NotiBell': {
        this.modalService.openModal('notifications', 'Notifications', {notifications: this._ACTIVITIES, id: this.pId}, 'notificationsModal').catch(() => {});
        break;
      }
      case '_MESSAGE': {
        this.modalService.openModal('messages', 'Messages', {messages: this._MSG, id: null}, 'msgsModal').catch(() => {});
        break;
      }
      case 'reminder': {
        await this.helper.presentLoadingWithOptions();
        this.api.apiCall(PURPOSE.SET_REMINDER, {
          project_id: this.pId,
          user_id: this.user.userId || 0
        }, true).then(() => {
          this.getDetails();
        });
        break;
      }
      case 'uploadPhotoDoc': {
        this.uploader.uploadFile().then((files: any) => {
          this.uploadDoc(files);
        }).catch(() => {});
        break;
      }
      case 'addProjectReply': {
        const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
        if (this.replyForm.valid) {
          this.helper.presentLoadingWithOptions('Replying post...').catch(() => {});
          const formData = new FormData();
          formData.append('project_id', this.pId);
          formData.append('current_user_id', StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID));
          formData.append('message', this.replyForm.value.this_input);
          formData.append('message_id', data.message_id);
          _.forEach(this.tempFilesToUpReply, file => {
            formData.append('file[]', file.imgBlobs, file.myFile.name);
          });
          this.api.apiCall(PURPOSE.ADD_COMMENTS, formData, false, true, '2000', 'bottom', false).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.tempFileArrReply = []; this.tempFilesToUpReply = []; this.tempErrorFileSelectReply = null;
              this.replyForm.reset();
              this.getDetails();
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        } else {
          StaticService.markFormGroupTouched(this.replyForm, invalidElements);
        }
        break;
      }
      case 'addProjectComment': {
        const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
        if (this.commentForm.valid) {
          this.helper.presentLoadingWithOptions('Sending post...').catch(() => {});
          const formData = new FormData();
          formData.append('project_id', this.pId);
          formData.append('current_user_id', StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID));
          formData.append('message', this.commentForm.value.this_input);
          _.forEach(this.tempFilesToUp, file => {
            formData.append('file[]', file.imgBlobs, file.myFile.name);
          });
          this.api.apiCall(PURPOSE.ADD_COMMENTS, formData, false, true, '2000', 'bottom', false).then((res: any) => {
            if (ApiService._successRes(res)) {
              this.tempFileArr = []; this.tempFilesToUp = []; this.tempErrorFileSelect = null;
              this.commentForm.reset();
              this.getDetails();
            }
            this.helper.dismissLoading();
          }).catch(() => {});
        } else {
          StaticService.markFormGroupTouched(this.commentForm, invalidElements);
        }
        break;
      }
      case 'ReplyComment': {
        mType = type;
        modalHead = 'Reply Comment';
        modalCssClass = 'replyProjectComment';
        modalData = {
          saveBtnText: 'Reply',
          placeholder: 'Reply here...',
          projectId: this.pId,
          currentUserId: StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID)
        };
        break;
      }
      case 'addMileStone': {
        mType = 'adjustMilestone';
        modalHead = 'Adjust Milestone #' + data.index;
        modalCssClass = 'adMilestoneModal';
        modalData = {
          projectId: this.pId,
          milestoneData: data
        };
        break;
      }
      case 'removeMilestone': {
        this.helper.presentAlertConfirm('Confirm', 'Are you sure you want to remove?', 'Yes, please!', 'No').then(async (isConfirm) => {
          if (isConfirm) {
            this.helper.presentLoadingWithOptions().catch(() => {});
            this.api.apiCall(PURPOSE.DELETE_PAYMENT_ADJUSTMENT, {
              project_id: this.pId,
              milestone_id: data.index,
              adjustment_row: data.indexAR
            }, true).then(() => {
              this.getDetails();
            });
          }
        }).catch(() => {});
        break;
      }
      case 'secureBooking': {
        this.helper.presentAlertConfirm('Confirm!', 'Please review the scope, schedule and payments before accepting', 'Yes, please!', 'No').then((isConfirm) => {
          if (isConfirm) {
            this.helper.presentLoadingWithOptions().catch(() => {});
            this.api.apiCall(PURPOSE.MANAGE_TIMEFRAME, {
              current_user_id : this.userId,
              project_id: this.pId,
              action_name: data.name,
              action_value: data.value,
            }, true).then(() => {
              this.getDetails();
            });
          }
        }).catch(() => {});
        break;
      }
      case 'complete': {
        this.helper.presentLoadingWithOptions().catch(() => {});
        this.api.apiCall(PURPOSE.MANAGE_TIMEFRAME, {
          current_user_id : this.userId,
          project_id: this.pId,
          action_name: data.name,
          action_value: data.value
        }, true).then(() => {
          this.getDetails();
        });
        break;
      }
      case 'markCompleteTaskDone': {
        this.helper.presentLoadingWithOptions().catch(() => {});
        this.api.apiCall(PURPOSE.MANAGE_SCHEDULES, {
          project_id: this.pId,
          schedule_row: data.schedule_row,
          task_row: data.task_row
        }, true).then(() => {
          this.getDetails();
        });
        break;
      }
      case 'add_schedules': {
        mType = 'manageSchedules';
        modalHead = this.data.schedules.length ? 'Manage Schedules' : 'Add Schedule';
        modalCssClass = 'AddSchedules';
        modalData = {
          projectId: this.pId,
          userId: this.user.userId,
          scheduleData: this.data.schedules,
          projectScheduleTemplate: this.data.project_schedule_template
        };
        break;
      }
      case 'add_variations': {
        mType = 'manageVariations';
        modalHead = this.data.project_variations.length ? 'Manage Variations' : 'Add Variations';
        modalCssClass = 'AddVariations';
        modalData = {
            projectId: this.pId,
            userId: this.user.userId,
            variationData: this.data.project_variations
        };
        break;
      }
      case 'uploadSchedule': {
        this.uploader.uploadFile().then((files: any) => {
          this.uploadDoc(files, 'schedule', data);
        }).catch(() => {});
        break;
      }
      case 'mark': {
        const msg = (data.action === 'mark_as_paid') ? 'Are you sure you want to mark invoice as Paid?' : (data.action === 'mark_as_done') ? 'Are you sure you want to mark invoice as Done?' : 'Are you sure you want to remind client about invoice?';
        this.helper.presentAlertConfirm('Confirm!', msg, 'Yes, please!', 'No').then(isConfirm => {
          if (isConfirm) {
            this.helper.presentLoadingWithOptions();
            this.api.apiCall(PURPOSE.PAYMENT_LIST_ACTION, {
              project_id: this.pId,
              milestone: data.milestone,
              action: data.action,
              type: (data.type) ? data.type : null,
              current_user_id: StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID),
            }, true).then((res: any) => {
              if (ApiService._successRes(res)) {
                this.getDetails();
              }
            }).catch(() => {});
          }
        }).catch(() => {});
        break;
      }
      case 'InvoiceDetail': {
        if (other) {
          this.helper.pushPage(APP_PAGES.INVOICE_DETAIL, { invoiceId: data, user: this.user});
        }
        break;
      }
      case 'removeScope': {
        this.helper.presentAlertConfirm('Confirm', 'Do you really want to remove this scope?', 'Remove', 'No').then(async (isConfirm) => {
          if (isConfirm) {
            this.helper.presentLoadingWithOptions('Removing Scope...').catch(() => {});
            this.api.apiCall(PURPOSE.REMOVE_PROJECT_SCOPE, {
              project_id: this.pId,
              current_user_id: StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID),
              scope_id: data
            }, true).then((res: any) => {
              if (ApiService._successRes(res)) {
                this.getDetails();
              }
            });
          }
        }).catch(() => {});
        break;
      }
      case 'addNewScope': {
        this.helper.pushPage(APP_PAGES.ADD_SCOPE, {projectId: this.pId, user : this.user});
        break;
      }
      case 'editScope': {
        this.helper.pushPage(APP_PAGES.EDIT_SCOPE, {projectId: this.pId, user : this.user, scopeId: data, timeframe: this.data.timeframe});
        break;
      }
      case 'editContractorPrice': {
        mType = 'editContractorPrice';
        modalHead = 'Edit Contractor Price';
        modalCssClass = 'editContractorPriceModal';
        modalData = {
          project_id: this.pId,
          uType: 'contractor',
          current_user_id : this.user.userId,
          contractor: data
        };
        break;
      }
      case 'markScheduleDone': {
        this.helper.presentLoadingWithOptions().catch(() => {});
        this.api.apiCall(PURPOSE.MARK_SCHEDULE_DONE, {
          project_id: this.pId,
          current_user_id: StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID),
          row: data,
        }, true).then((res: any) => {
          if (ApiService._successRes(res)) {
            this.getDetails();
          }
        }).catch(() => {});
        break;
      }
      case 'removeProject': {
        this.helper.presentAlertConfirm('Confirm', 'Do you really want to remove this Project?', 'Remove', 'No').then(async (isConfirm) => {
          if (isConfirm) {
            this.helper.presentLoadingWithOptions('Removing Project...').catch(() => {});
            this.api.apiCall(PURPOSE.REMOVE_PROJECT, {
              projectId: this.pId
            }, true).then((res) => {
              if (ApiService._successRes(res)) {
                this.helper.popPage();
              }
            });
          }
        }).catch(() => {});
        break;
      }
      case 'removeTeamUser': {
        this.helper.presentAlertConfirm('Confirm', 'Are you sure want to remove this user?', 'Remove', 'No').then(async (isConfirm) => {
          if (isConfirm) {
            this.helper.presentLoadingWithOptions('Removing User...').catch(() => {});
            this.api.apiCall(PURPOSE.REMOVE_PEOPLE, {
              projectId: this.pId,
              type: data.user_role,
              team_user_id: data.ID
            }, true).then((res) => {
              if (ApiService._successRes(res)) {
                this.getDetails();
              }
            });
          }
        }).catch(() => {});
        break;
      }
      default: {
        break;
      }
    }
    if (mType && Object.keys(modalData).length) {
      this.modalService.openModal(mType, modalHead, modalData, modalCssClass).then((res: any) => {
        if (res && !res.isCancel) {
          this.getDetails();
        }
      }).catch(() => {});
    }
  }
  presentAlert(action) {
    const modalData: any = {};
    modalData.projectId = this.pId;
    modalData.action = action;
    let head = '';
    let cssClass = '';
    switch (action) {
      case 'change_title': {
        head = 'Manage Quote Title';
        cssClass = 'manageQuoteTitle';
        modalData.inputLabel = head;
        modalData.inputValue = this.data.scope.title || '';
        break;
      }
      case 'timeframe': {
        head = 'Manage Timeframe';
        cssClass = 'manageTimeframe';
        modalData.inputLabel = head;
        modalData.timeframe = this.data.timeframe || [];
        modalData.inputValue = this.data.scope.status || '';
        break;
      }
      case 'start_date': {
        head = 'Manage Start Date';
        cssClass = 'manageSaveDate';
        modalData.inputLabel = head;
        modalData.inputValue = this.data.scope.start_date;
        break;
      }
      case 'change_status': {
        head = 'Manage Quote Status';
        cssClass = 'manageQuoteStatus';
        modalData.inputLabel = head;
        modalData.inputValue = this.data.status || '';
        modalData.inputValueBefore = this.data.status || '';
        modalData.statusArr = this.statusArr;
        break;
      }
      default: {
        break;
      }
    }
    this.modalService.openModal('manageProjectActions', head, modalData, cssClass).then((res: any) => {
      if (res && !res.isCancel) {
        this.getDetails();
      }
    }).catch(() => {});
  }
  getActivities() {
    this.api.getNotification(this.pId, true).then((res: any) => {
      if (res) { this._ACTIVITIES = res; }
    }).catch(() => {});
  }
  getMessage() {
    this.api.getMessages(this.pId, true).then((res) => {
      if (res) { this._MSG = res; }
    }).catch(() => {});
  }
  uploadDoc(files, type = 'project', row = null) {
    if (files.length) {
      this.helper.presentLoadingWithOptions().catch(() => {});
      const userId = StaticService.getUser(this.user, STORAGE_GET_DATA.USER_ID);
      const formData = new FormData();
      formData.append('project_id', this.pId);
      formData.append('current_user_id', userId);
      formData.append('type', type);
      _.forEach(files, file => {
        formData.append('file[]', file.imgBlobs, file.myFile.name);
      });
      if (type === 'schedule') {
        formData.append('row', row);
      }
      this.api.apiCall(PURPOSE.UPLOAD_DOCUMENTS, formData, true, true, '2000', 'bottom', false).then((res: any) => {
        if (ApiService._successRes(res)) {
          this.getDetails();
        }
      }).catch(() => {});
    }
  }
  OpenAddPeopleSelect() {
    this.helper.AddPeopleSelect().then((res) => {
      if (res) {
        const head = (res === 'head_clients') ? 'Add Quote Manager' : (res === 'head_suplliers') ? 'Add Supplier' : 'Add Contractor';
        const uDataList = {
          udata : (res === 'head_clients') ? this.data.user_list_by_type.head_clients : (res === 'head_suplliers') ? this.data.user_list_by_type.head_suplliers : this.data.user_list_by_type.head_contractors,
          uType : (res === 'head_clients') ? 'agent' : (res === 'head_suplliers') ? 'supplier' : 'contractor',
          current_user_id : this.user.userId,
          project_id: this.pId,
          project_total: this.data.project_total
        };
        this.modalService.openModal('addPeople', head, uDataList, 'addPeopleModal').then((result: any) => {
            if (result && !result.isCancel) {
                this.getDetails();
            }
        }).catch(() => {});
      }
    });
  }
  addNewFile(isReply = false) {
    this.uploader.uploadFile().then((selectedFiles: any) => {
      if (selectedFiles && _.isArray(selectedFiles) && selectedFiles.length) {
        if (isReply) {
          this.tempErrorFileSelectReply = null;
          if (!this.tempFilesToUpReply) {
            this.tempFilesToUpReply = [];
          }
          _.forEach(selectedFiles, img => {
            this.tempFileArrReply.push({id: (this.tempFileArrReply.length + 1), url: img.readFileSrc, fileType: img.myFile.type });
            this.tempFileArrReply = _.reverse(this.tempFileArrReply);
            this.tempFilesToUpReply.push(img);
            this.tempFilesToUpReply = _.reverse(this.tempFilesToUpReply);
          });
        } else {
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
      }
    }).catch(() => {});
  }
  onTempDeleteFile(e, isReply = false) {
    const type = e.type;
    const evData = e.data; // {imgIndex: imgIndex, img: img}
    if (type === 'delete') {
      if (isReply) {
        this.tempFileArrReply.splice(evData.imgIndex, 1);
        this.tempFilesToUpReply.splice(evData.imgIndex, 1);
        if (this.tempFileArrReply.length) {
          this.tempFileArrReply = _.reverse(_.sortBy(this.tempFileArrReply, 'id'));
        } else {
          this.tempErrorFileSelectReply = VALIDATION_MSG.ERR_REQUIRED_SELECT_FILE;
        }
        if (this.tempFilesToUpReply.length) {
          this.tempFilesToUpReply = _.reverse(_.sortBy(this.tempFilesToUpReply));
        } else {
          this.tempErrorFileSelectReply = VALIDATION_MSG.ERR_REQUIRED_SELECT_FILE;
        }
      } else {
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
  }
  vCheck(fieldName, type: INPUT_TYPE_NAME = 'OTHER', isReply = false, options: any = {}) {
    options.isRequired = true;
    if (this.commentForm && !isReply) { return StaticService.formError(this.commentForm.controls, fieldName, type, options).msg; }
    if (this.replyForm && isReply) { return StaticService.formError(this.replyForm.controls, fieldName, type, options).msg; }
  }
  vCheck1(fieldName, type: INPUT_TYPE_NAME = 'OTHER', options: any = {}) {
    options.isRequired = true;
    if (this.saveReviewForm) {
      return StaticService.formError(this.saveReviewForm.controls, fieldName, type, options).msg;
    }
  }
  clickonStar(i) {
    _.forEach(this.starArr, v => {
      v.iconName = 'star-outline';
      v.ClassName = 'starOC';
    });
    // console.log('s', i);
    for (let x = 0; x < (i + 1); x++) {
      this.starArr[x].iconName = 'star';
      this.starArr[x].className = 'starC';
    }
    this.selectedStar = (i + 1);
  }
  SaveReviewSubmit() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (this.saveReviewForm.valid) {
      this.helper.presentLoadingWithOptions('Saving review...').catch(() => {});
      const formData = new FormData();
      formData.append('projectId', this.pId);
      formData.append('review', this.saveReviewForm.value.review);
      formData.append('rating', this.selectedStar);
      this.api.apiCall(PURPOSE.SAVE_REVIEW, formData, false, true, '2000', 'bottom', false).then((res: any) => {
        if (ApiService._successRes(res)) {
          // this.saveReviewForm.reset();
          this.getDetails();
        }
        this.helper.dismissLoading();
      }).catch(() => {});
    } else {
      StaticService.markFormGroupTouched(this.saveReviewForm, invalidElements);
    }
  }
}
