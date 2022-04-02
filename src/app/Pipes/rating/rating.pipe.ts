import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {
  str = '';
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(value: any, ...args: any[]): any {
    const v1 = 5; let halfEmpty = 0; this.str = '';
    if (value) {
      let i = 1;
      while (i <= v1) {
        if (i <= value) {
          this.str = this.str + '<ion-icon name="star"></ion-icon>';
        } else {
          if (!_.isInteger(value) && !halfEmpty) {
            this.str = this.str + '<ion-icon name="star-half"></ion-icon>';
            //  res.concat('<ion-icon name="star-outline"></ion-icon>');
            halfEmpty = 1;
          } else {
            this.str = this.str + '<ion-icon name="star-outline"></ion-icon>';
          }
        }
        i++;
      }
    } else {
      for (let i = 0; i < v1; i++) {
        this.str = this.str + '<ion-icon name="star-outline"></ion-icon>';
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(this.str);
  }

}
