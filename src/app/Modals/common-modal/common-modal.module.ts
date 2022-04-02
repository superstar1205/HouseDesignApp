import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule } from '@ionic/angular';
import {CommonModalPage } from './common-modal.page';
import {ComponentsModule} from '../../Components/components.module';
import {PipesModule} from '../../Pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [CommonModalPage],
  entryComponents: [CommonModalPage]
})
export class CommonModalPageModule {}
