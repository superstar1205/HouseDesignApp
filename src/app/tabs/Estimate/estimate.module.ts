import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstimatePage } from './estimate.page';
import {ComponentsModule} from '../../Components/components.module';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: EstimatePage}]),
    ComponentsModule,
    LazyLoadImageModule.forRoot({ preset: intersectionObserverPreset })
  ],
  declarations: [EstimatePage]
})
export class EstimatePageModule {}
