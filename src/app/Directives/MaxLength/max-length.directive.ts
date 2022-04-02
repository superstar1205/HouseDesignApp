import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Platform} from '@ionic/angular';

@Directive({
  selector: '[appMaxLength]'
})
export class MaxLengthDirective {
  @Input('appMaxLength') cMaxLength: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(public platform: Platform) { }
  @HostListener('keyup', ['$event']) onKeyup(event) {
    const element = event.target as HTMLInputElement;
    const limit = this.cMaxLength;
    const value = element.value.substr(0, limit);
    if (value.length <= limit) {
      element.value = value;
    } else {
      element.value = value.substr(0, limit - 1);
    }
    this.ngModelChange.emit(element.value);
  }
  @HostListener('focus', ['$event']) onFocus(event) {
    const element = event.target as HTMLInputElement;
    if (!this.platform.is('android')) {
      element.setAttribute('maxlength', this.cMaxLength);
    }
  }
}
