import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCaps',
})
export class FirstCapsPipe implements PipeTransform {
  transform(value: string) {
    return value.charAt(0).toUpperCase();
  }
}
