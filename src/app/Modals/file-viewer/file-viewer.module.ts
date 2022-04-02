import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FileViewerPage } from './file-viewer.page';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset})
  ],
  declarations: [FileViewerPage],
  entryComponents: [FileViewerPage]
})
export class FileViewerPageModule {}
