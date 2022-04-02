import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCapsString',
})
export class FirstCapsStringPipe implements PipeTransform {
  transform(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
