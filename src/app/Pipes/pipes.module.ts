import { NgModule } from '@angular/core';
import {TimeAgoPipe} from './timeAgo/time-ago.pipe';
import {PhpToJsDatePipe} from './phpToJsDate/php-to-js-date.pipe';
import {RemoveUnderScorePipe} from './RemoveUnderScore/remove-under-score.pipe';
import { ViewInPipe } from './viewIn/view-in.pipe';
import { FileSizePipe } from './fileSize/file-size.pipe';
import { ShortStringPipe } from './shortString/short-string.pipe';
import { NumberCollectionPipe } from './numberCollection/number-collection.pipe';
import { FilterArrPipe } from './filterArr/filter-arr.pipe';
import { SortByPipe } from './sortBy/sort-by.pipe';
import { MyMathOprPipe } from './myMathOpr/my-math-opr.pipe';
import { RatingPipe } from './rating/rating.pipe';
import {FirstCapsPipe} from './first-caps/first-caps';
import {FirstCapsStringPipe} from './first-caps-string/first-caps-string';
import { FormatterPipe } from './formatter/formatter.pipe';
import { ToFixedPipe } from './toFixed/to-fixed.pipe';

@NgModule({
  declarations: [
    PhpToJsDatePipe,
    RemoveUnderScorePipe,
    TimeAgoPipe,
    ViewInPipe,
    FileSizePipe,
    ShortStringPipe,
    NumberCollectionPipe,
    FilterArrPipe,
    SortByPipe,
    MyMathOprPipe,
    RatingPipe,
    FirstCapsPipe,
    FirstCapsStringPipe,
    FormatterPipe,
    ToFixedPipe
  ],
  imports: [],
  exports: [
    PhpToJsDatePipe,
    RemoveUnderScorePipe,
    TimeAgoPipe,
    ViewInPipe,
    FileSizePipe,
    ShortStringPipe,
    NumberCollectionPipe,
    FilterArrPipe,
    SortByPipe,
    MyMathOprPipe,
    RatingPipe,
    FirstCapsPipe,
    FirstCapsStringPipe,
    FormatterPipe,
    ToFixedPipe
  ],
})

export class PipesModule {}
