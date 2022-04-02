import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import _ from 'lodash';
import {HelperService} from '../../Services/Helper/helper.service';
import {INPUT_TYPE_NAME} from '../../keyOf';
import {StaticService} from '../../Services/static/static.service';
import {ApiService} from '../../Services/api/api.service';
import {PURPOSE} from '../../app-constants.service';

@Component({
  selector: 'app-variations',
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.scss'],
})
export class VariationsComponent implements OnInit {
  @Output() onTrigger = new EventEmitter<any>();
  @Input() public userId = 0;
  @Input() public projectId = 0;
  @Input() public vData = [];
  sForm: FormGroup;
  constructor(private _FB: FormBuilder,
              private el: ElementRef,
              private api: ApiService,
              public helper: HelperService) { }

  ngOnInit(): void {
      this.setFormVal();
      if (!this.vData.length) {
          this.addNewForm();
      }
  }
  vCheck(formControl, fieldName, type: INPUT_TYPE_NAME = 'OTHER', options: any = {}) {
      options.isRequired = true;
      if (formControl) { return StaticService.formError(formControl, fieldName, type, options).msg; }
  }
  setFormVal() {
      this.sForm = this._FB.group({
          field : this.getSeccion(this.vData),
      });
  }
  getSeccion(storageData: any[], flag: any = 0): FormArray {
      if (flag === 0) {
          const arr: any = [];
          _.forEach(storageData, (val, key) => {
              arr.push(this._FB.group({
                  title: [val.title, Validators.required],
                  due_date: [val.due_date_format, Validators.required],
                  percent: [val.percent, Validators.required],
                  description: [val.description],
                  done: [val.done],
                  status: [val.status],
                  paid: [val.paid],
                  invoice_id: [val.invoice_id]
              }));
          });
          return this._FB.array(arr);
      }
  }
  initFormFields(): FormGroup {
    return this._FB.group({
      title: ['', Validators.required],
      due_date: ['', Validators.required],
      percent: ['', Validators.required],
      description: ['']
    });
  }
  addNewForm() {
      const control = this.sForm.controls.field as FormArray;
      control.push(this.initFormFields());
  }
  removeForm(ix) {
    if ((this.sForm.controls.field as FormArray).length > 1) {
      const control = (this.sForm.controls.field as FormArray) as FormArray;
      control.removeAt(ix);
    }
  }
  saveForm() {
      const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
      const formData = this.sForm.controls.field.value;
      _.forEach(formData, (val, key) => {
          val.due_date = this.helper.getCDT('MM/DD/YYYY', val.due_date);
      });
      console.log('final data', formData);
      if (this.sForm.valid) {
          this.helper.presentLoadingWithOptions('Saving data...').catch(() => {});
          this.api.apiCall(PURPOSE.UPDATE_VARIATIONS, {
              variationData : formData,
              project_id: this.projectId,
              user_id: this.userId,
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

}
