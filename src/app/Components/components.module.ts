import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';
import {PipesModule} from '../Pipes/pipes.module';
import {ErrorComponent} from './error/error.component';
import {HeaderComponent} from './header/header.component';
import {DirectivesModule} from '../Directives/directives.module';
import {TabLoginComponent} from './tab-login/tab-login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './search/search.component';
import {SelectComponent} from './select/select.component';
import {ProgressLoadingComponent} from './progress-loading/progress-loading.component';
import {MoreButtonComponent} from './more-button/more-button.component';
import {PopoverComponent} from './popover/popover.component';
import {FilterComponent} from './filter/filter.component';
import {TabPaymentListComponent} from './tab-payment-list/tab-payment-list.component';
import {ImageRowComponent} from './image-row/image-row.component';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {VariationsComponent} from './variations/variations.component';
import {BellComponent} from './bell/bell.component';
import {QuotesComponent} from './quotes/quotes.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset}),
    PipesModule, DirectivesModule, ReactiveFormsModule, FormsModule
  ],
  declarations: [
    ErrorComponent,
    HeaderComponent,
    TabLoginComponent,
    SearchComponent,
    SelectComponent,
    ProgressLoadingComponent,
    PopoverComponent,
    MoreButtonComponent,
    FilterComponent,
    TabPaymentListComponent,
    ImageRowComponent,
    ImageViewerComponent,
    ScheduleComponent,
    VariationsComponent,
    BellComponent,
    QuotesComponent
  ],
  exports: [
    ErrorComponent,
    HeaderComponent,
    TabLoginComponent,
    SearchComponent,
    SelectComponent,
    ProgressLoadingComponent,
    PopoverComponent,
    MoreButtonComponent,
    FilterComponent,
    TabPaymentListComponent,
    ImageRowComponent,
    ImageViewerComponent,
    ScheduleComponent,
    VariationsComponent,
    BellComponent,
    QuotesComponent
  ],
  entryComponents: [PopoverComponent],
})
export class ComponentsModule { }
