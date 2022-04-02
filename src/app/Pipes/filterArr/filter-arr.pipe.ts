import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'filterArr'
})
export class FilterArrPipe implements PipeTransform {

  transform(value: any, args: any= {}): any {
    return _.filter(value, val => {
      return val[args.filterKey] === args.filterVal;
    });
  }

}
