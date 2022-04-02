import {Injectable} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SelectablePage} from '../../Modals/selectable/selectable.page';
import {CommonModalPage} from '../../Modals/common-modal/common-modal.page';
import {FileViewerPage} from '../../Modals/file-viewer/file-viewer.page';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalCtrl: ModalController) { }
  openModal(mType = null, headerTitle = null, mData: any = {}, cssClass = null, pageType = 'CommonModal', touchForm = null) {
    let myCssClass = '';
    let page: any;
    if (pageType === 'Selectable') {
      page = SelectablePage;
      myCssClass = 'mySelectableModal ';
    } else if (pageType === 'CommonModal') {
      page = CommonModalPage;
      myCssClass = 'myCommonModal ';
    }
    return new Promise(async (resolve) => {
      const cModal = await this.modalCtrl.create({
        component: page,
        cssClass: myCssClass + cssClass,
        mode: 'ios',
        backdropDismiss: false,
        componentProps: {
          headerTitle,
          mType,
          sData: mData,
          currentSelected: (mData && mData.currentSelected) ? mData.currentSelected : null,
        }
      });
      cModal.onDidDismiss().then((dataReturned) => {
        if (dataReturned && dataReturned.data) {
          return resolve(dataReturned.data);
        }
        if (touchForm) {
          try {
            touchForm.markAsTouched();
          } catch (e) {}
        }
      }).catch(() => {});
      setTimeout(async () => {
        return await cModal.present().catch((e) => console.log(e) );
      }, 100);
    });
  }
  async onViewFile(files: any = [], initialIndex = 0, urlKey = 'url', titleKey = 'title') {
    const filterFiles = [];
    _.forEach(files, (value) => {
      if (value[urlKey]) {
        filterFiles.push({
          url: value[urlKey],
          title: value[titleKey] || ''
        });
      }
    });
    const cModal = await this.modalCtrl.create({
      component: FileViewerPage,
      cssClass: 'myFileViewerModal',
      mode: 'ios',
      componentProps: {
        filesArray: filterFiles,
        initialSlide: initialIndex
      }
    });
    return await cModal.present().catch((e) => console.log(e) );
  }
}
