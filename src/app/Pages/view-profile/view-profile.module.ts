import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewProfilePage } from './view-profile.page';
import {ComponentsModule} from '../../Components/components.module';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';
import {PipesModule} from '../../Pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ViewProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule, PipesModule,
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset}),
  ],
  declarations: [ViewProfilePage]
})
export class ViewProfilePageModule {}
