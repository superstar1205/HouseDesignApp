import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IonicStorageModule} from '@ionic/storage';
import {HttpClientModule} from '@angular/common/http';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';
import {NgxMaskIonicModule} from 'ngx-mask-ionic';
import {Camera} from '@ionic-native/camera/ngx';
import {Toast} from '@ionic-native/toast/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener } from '@ionic-native/file-opener/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {Chooser } from '@ionic-native/chooser/ngx';
import {DatePipe} from '@angular/common';
import {SelectablePageModule} from './Modals/selectable/selectable.module';
import {CommonModalPageModule} from './Modals/common-modal/common-modal.module';
import {FileViewerPageModule} from './Modals/file-viewer/file-viewer.module';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      backButtonIcon: 'ios-undo',
      backButtonText: '',
      infiniteLoadingSpinner: 'dots'
    }),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__sgtechHouseAceDb',
    }),
    HttpClientModule,
    LazyLoadImageModule.forRoot({ preset: intersectionObserverPreset }),
    NgxMaskIonicModule.forRoot(),
    SelectablePageModule, CommonModalPageModule, FileViewerPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera, Toast, Keyboard, File, FileTransfer, FileOpener, AndroidPermissions, ImagePicker, Chooser,
    DatePipe, OneSignal, AppVersion
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
