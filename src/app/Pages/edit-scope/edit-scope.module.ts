import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditScopePage } from './edit-scope.page';
import {ComponentsModule} from '../../Components/components.module';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';
import {DirectivesModule} from '../../Directives/directives.module';
import {PipesModule} from '../../Pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: EditScopePage
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
  declarations: [EditScopePage],
  entryComponents: [EditScopePage]
})
export class EditScopePageModule {}
