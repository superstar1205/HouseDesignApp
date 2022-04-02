import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddScopePage } from './add-scope.page';
import {ComponentsModule} from '../../Components/components.module';

const routes: Routes = [
  {
    path: '',
    component: AddScopePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [AddScopePage]
})
export class AddScopePageModule {}
