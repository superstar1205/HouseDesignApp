import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberCollection'
})
export class NumberCollectionPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const res = [];
    for (let i = 0; i < value; i++) {
      res.push(i);
    }
    return res;
  }

}
