import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'removeUnderScore'
})
export class RemoveUnderScorePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return _.toString(value).replace(/_/g, ' ');
  }

}
