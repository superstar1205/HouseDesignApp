import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InvoiceDetailPage } from './invoice-detail.page';
import {DirectivesModule} from '../../Directives/directives.module';
import {PipesModule} from '../../Pipes/pipes.module';
import {ComponentsModule} from '../../Components/components.module';

const routes: Routes = [
  {
    path: '',
    component: InvoiceDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [InvoiceDetailPage]
})
export class InvoiceDetailPageModule {}
