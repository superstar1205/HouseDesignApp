import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phpToJsDate'
})
export class PhpToJsDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.replace(' ', 'T');
  }

}
