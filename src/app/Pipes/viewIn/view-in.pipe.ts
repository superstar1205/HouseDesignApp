import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'viewIn'
})
export class ViewInPipe implements PipeTransform {
  transform(value: any, args?: any, type: any = 'string'): any {
    if (type === 'string') {
      return (value !== null && value !== undefined && value !== '' && _.trim(_.toString(value)) !== '') ? value : (args ? args : '-');
    } else if (type === 'array') {
      return this.transform( _.filter(value, val => {
        if (val && val.trim()) { return val; }
      }).join(', '));
    }
  }
}
