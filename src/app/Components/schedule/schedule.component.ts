import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import _ from 'lodash';
import {HelperService} from '../../Services/Helper/helper.service';
import {INPUT_TYPE_NAME} from '../../keyOf';
import {StaticService} from '../../Services/static/static.service';
import {ApiService} from '../../Services/api/api.service';
import {PURPOSE} from '../../app-constants.service';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @Output() onTrigger = new EventEmitter<any>();
  @Input() public userId = 0;
  @Input() public projectId = 0;
  @Input() public sData = [];
  @Input() public projectScheduleTemplate = [];
  sForm: FormGroup;
  constructor(private _FB: FormBuilder,
              private el: ElementRef,
              private api: ApiService,
              public helper: HelperService) {
  }
  ngOnInit(): void {
    this.setFormVal();
    if (!this.sData.length) {
      this.addNewForm();
    }
  }
  vCheck(formControl, fieldName, type: INPUT_TYPE_NAME = 'OTHER', options: any = {}) {
    options.isRequired = true;
    if (formControl) { return StaticService.formError(formControl, fieldName, type, options).msg; }
  }
  setFormVal() {
    this.sForm = this._FB.group({
      field : this.getSeccion(this.sData),
    });
  }
  getSeccion(storageData: any[], flag: any = 0): FormArray {
    if (flag === 0) {
      console.log('storageData', storageData);
      const arr: any = [];
      _.forEach(storageData, (val, key) => {
        arr.push(this._FB.group({
          title: [val.title, Validators.required],
          dateFrom: [val.date_from_format, Validators.required],
          dateTo: [val.date_to_format, Validators.required],
          description: [val.description],
          done: [val.done],
          photosArray: this.getSeccion(val.photos, 2),
          tasks: this.getSeccion(val.tasks, 1)
        }));
      });
      return this._FB.array(arr);
    } else if (flag === 1) {
      const arrTask: any = [];
      _.forEach(storageData, (val) => {
        arrTask.push(this._FB.group({
          taskTitle: [val.title, Validators.required],
          taskDone: [val.task_done]
        }));
      });
      return this._FB.array(arrTask);
    } else if (flag === 2) {
      const arrPhoto: any = [];
      _.forEach(storageData, (val) => {
        arrPhoto.push(this._FB.group({
          photo: [val]
        }));
      });
      return this._FB.array(arrPhoto);
    }
  }
  initFormFields(): FormGroup {
    return this._FB.group({
      title: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      description: [''],
      photosArray: this._FB.array([this.taskFields('photo')]),
      done: [false],
      tasks : this._FB.array([this.taskFields()]),
    });
  }
  taskFields(type = 'title'): FormGroup {
    if (type === 'photo') {
      return this._FB.group({
        photo: ['']
      });
    } else {
      return this._FB.group({
        taskTitle: ['', Validators.required],
        taskDone: [false]
      });
    }
  }
  addNewInputField(ix) {
    const control = (this.sForm.controls.field as FormArray).at(ix).get('tasks') as FormArray;
    const temp = control.value.filter((val) => {
      return !val.taskTitle;
    });
    if (temp.length) {
      console.log('Fill it first', temp);
    } else {
      control.push(this.taskFields());
    }

  }
  addNewForm() {
    const control = this.sForm.controls.field as FormArray;
    control.push(this.initFormFields());
  }
  removeInputField(ix, iy): void {
    const control = (this.sForm.controls.field as FormArray).at(ix).get('tasks') as FormArray;
    control.removeAt(iy);
  }
  removeForm(ix) {
    const control = (this.sForm.controls.field as FormArray) as FormArray;
    control.removeAt(ix);
  }
  saveForm() {
    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    const formData = this.sForm.controls.field.value;
    _.forEach(formData, val => {
      val.dateFrom = this.helper.getCDT('MM/DD/YYYY', this.helper._MOMENT(val.dateFrom).add('1', 'days'));
      val.dateTo = this.helper.getCDT('MM/DD/YYYY', this.helper._MOMENT(val.dateTo).add('1', 'days'));
    });
    if (this.sForm.valid) {
      this.helper.presentLoadingWithOptions('Saving data...').catch(() => {});
      this.api.apiCall(PURPOSE.SAVE_SCHEDULE, {
        scheduleData : formData,
        project_id: this.projectId
      }, true).then((res: any) => {
        if (ApiService._successRes(res)) {
          this.onTrigger.emit({status: true, res});
        }
        this.helper.dismissLoading();
      }).catch(() => {});
    } else {
      StaticService.markFormGroupTouched(this.sForm, invalidElements);
    }
  }
  onChangeTemplate(ev) {
    this.helper.presentLoadingWithOptions().catch(() => {});
    this.api.apiCall(PURPOSE.GET_SCHEDULE_TEMPLATE_DETAILS, {
      current_user_id: this.userId,
      template_id: ev.target.value
    }, true).then((res: any) => {
      if (ApiService._successRes(res)) {
        this.sData = res.data.schedule_template;
        this.setFormVal();
      }
      this.helper.dismissLoading();
    }).catch(() => {});
  }
}
