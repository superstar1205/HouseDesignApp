import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AccountPage } from './account.page';
import {ComponentsModule} from '../../Components/components.module';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: AccountPage}]),
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset}),
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
