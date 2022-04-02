import {NgModule } from '@angular/core';
import {MaxLengthDirective} from './MaxLength/max-length.directive';
import {HideHeaderDirective} from './HideHeader/hide-header.directive';
import { ScrollVanishDirective } from './ScrollVanish/scroll-vanish.directive';
@NgModule({
  declarations: [
    MaxLengthDirective,
    HideHeaderDirective,
    ScrollVanishDirective
  ],
  imports: [],
  exports: [
    MaxLengthDirective,
    HideHeaderDirective,
    ScrollVanishDirective
  ]
})
export class DirectivesModule {}
