import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StepsPage } from './steps.page';
import {ComponentsModule} from '../../Components/components.module';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';
import {DirectivesModule} from '../../Directives/directives.module';
import {PipesModule} from '../../Pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: StepsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset}),
    DirectivesModule,
    ReactiveFormsModule, PipesModule
  ],
  declarations: [StepsPage]
})
export class StepsPageModule {}
