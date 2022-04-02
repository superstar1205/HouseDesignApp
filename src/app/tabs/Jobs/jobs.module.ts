import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsPage } from './jobs.page';
import {ComponentsModule} from '../../Components/components.module';
import {PipesModule} from '../../Pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: JobsPage}]),
    ComponentsModule,
    PipesModule
  ],
  declarations: [JobsPage]
})
export class JobsPageModule {}
