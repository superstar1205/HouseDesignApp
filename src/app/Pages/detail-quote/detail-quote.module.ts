import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailQuotePage } from './detail-quote.page';
import {ComponentsModule} from '../../Components/components.module';
import {DirectivesModule} from '../../Directives/directives.module';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';
import {PipesModule} from '../../Pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: DetailQuotePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    DirectivesModule,
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset}),
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [DetailQuotePage]
})
export class DetailQuotePageModule {}
