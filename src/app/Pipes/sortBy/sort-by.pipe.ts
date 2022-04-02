import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
  transform(array: Array<string>, sortByKey?: string, sortByOrder?: string) {
    const sortedArray = _.sortBy(array, sortByKey);
    return (sortByOrder && sortByOrder.toLowerCase() === 'desc') ? _.reverse(sortedArray) : sortedArray;
  }
}
