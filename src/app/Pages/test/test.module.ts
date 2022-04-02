import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TestPage } from './test.page';
import {ComponentsModule} from '../../Components/components.module';
import {NgxMaskIonicModule} from 'ngx-mask-ionic';

const routes: Routes = [
  {
    path: '',
    component: TestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NgxMaskIonicModule,
    ReactiveFormsModule
  ],
  declarations: [TestPage]
})
export class TestPageModule {}
