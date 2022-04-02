import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SelectablePage } from './selectable.page';
import {ComponentsModule} from '../../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule
  ],
  declarations: [SelectablePage],
  entryComponents: [SelectablePage]
})
export class SelectablePageModule {}
