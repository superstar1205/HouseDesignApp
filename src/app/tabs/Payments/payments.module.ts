import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PaymentsPage } from './payments.page';
import {ComponentsModule} from '../../Components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: PaymentsPage}]),
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [PaymentsPage]
})
export class PaymentsPageModule {}
