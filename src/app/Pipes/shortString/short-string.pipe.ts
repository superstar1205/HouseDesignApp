import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'shortString'
})
export class ShortStringPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const newStr: any = [];
    _.forEach(_.split(value, '&'), val => {
      newStr.push(val.toString().trim().charAt(0));
    });
    return _.replace(newStr, ',', '&');
  }

}
