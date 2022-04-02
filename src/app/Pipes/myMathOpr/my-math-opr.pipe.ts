import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'myMathOpr'
})
export class MyMathOprPipe implements PipeTransform {
  transform(value: any, type = 'sum'): any {
    const tempArr = [];
    _.forEach(value, n => {
      tempArr.push(_.toNumber(n));
    });
    return _.reduce(tempArr, (total, n) => {
      if (type === 'sum') {
        return total + n;
      } else if (type === 'sub') {
        return total - n;
      } else if (type === 'mul') {
        return total * n;
      } else if (type === 'div') {
        return total / n;
      } else if (type === 'mod') {
        return total % n;
      } else {
        return total + n;
      }
    });
  }

}
