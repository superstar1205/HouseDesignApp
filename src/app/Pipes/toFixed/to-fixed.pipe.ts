import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'toFixed'
})
export class ToFixedPipe implements PipeTransform {

  transform(value: any, arg: number = 2): any {
    return _.toNumber(value).toFixed(arg);
  }

}
