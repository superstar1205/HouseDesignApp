import { Injectable } from '@angular/core';
import {FILE_VAR, IMGS, VALIDATION_MSG} from '../../app-constants.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {File, FileEntry} from '@ionic-native/file/ngx';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {FileOpener } from '@ionic-native/file-opener/ngx';
import {ImagePicker, ImagePickerOptions} from '@ionic-native/image-picker/ngx';
import {Chooser} from '@ionic-native/chooser/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {HelperService} from '../Helper/helper.service';
import {ActionSheetController, Platform, ToastController} from '@ionic/angular';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private platform: Platform,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private file: File,
              private transfer: FileTransfer,
              private helper: HelperService,
              private imagePicker: ImagePicker,
              private chooser: Chooser,
              private androidPermissions: AndroidPermissions,
              private fileOpener: FileOpener,
              private toastCtrl: ToastController) { }
  uploadFile(subHeader: any = FILE_VAR.SUB_HEADER1, chooseFile = true, otherOptions: any = {}, multipleSelect: number = FILE_VAR.MULTIPLE_SELECT_DEFAULT, title = 'Upload File(s)', isRemove = false, cancelText = 'Cancel') {
    this.helper.onScrollCloseKeyBoard();
    if (!Object.keys(otherOptions).length) {
      otherOptions.acceptFiles = FILE_VAR.ALLOWED_FILE_TYPE;
      otherOptions.maxFileSize = FILE_VAR.MAX_FILE_SIZE_DEFAULT;
    }
    return new Promise(async (resolve, reject) => {
      const buttonsArray: any = [];
      if (isRemove) {
        buttonsArray.push({
          icon: 'trash',
          cssClass: 'icon',
          text: 'Remove photo',
          handler: () => {
            return resolve([{
              fileTarget  : null,
              fileName    : null,
              filePath    : null,
              readFileSrc : IMGS.DEFAULT_USER,
              myFile      : null,
              imgBlobs    : null
            }]);
          }
        });
      }
      buttonsArray.push({
        icon: 'camera',
        cssClass: 'icon',
        text: 'Take a photo',
        handler: () => {
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            allowEdit: true,
            targetWidth: 700,
            targetHeight: 700
          };
          this.getCameraPicture(options, otherOptions).then((imageLists) => {
            return resolve(imageLists);
          }).catch(() => {});
        }
      });
      if (multipleSelect > 1) {
        buttonsArray.push({
          icon: 'images',
          cssClass: 'icon',
          text: 'Choose from gallery',
          handler: () => {
            console.log('handler');
            this.imagePicker.hasReadPermission().then((hasPermission) => {
              console.log('hasPer', hasPermission);
              if (hasPermission) {
                this.imgPickerGetPic(multipleSelect, otherOptions).then((imageLists) => {
                  return resolve(imageLists);
                }).catch(() => {});
              } else {
                this.imgPickerGetPic(multipleSelect, otherOptions).then((imageLists) => {
                  return resolve(imageLists);
                }).catch(() => {});
              }
            }).catch(() => {});
          }
        });
      } else {
        buttonsArray.push({
          icon: 'images',
          cssClass: 'icon',
          text: 'Choose from gallery',
          handler: () => {
            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              correctOrientation: true,
              allowEdit: true
            };
            this.getCameraPicture(options, otherOptions).then((imageLists) => {
              return resolve(imageLists);
            }).catch(() => {});
          }
        });
      }
      if (chooseFile) {
        buttonsArray.push({
          icon: 'folder',
          cssClass: 'icon',
          text: 'Choose from files',
          handler: () => {
            this.chooser.getFile(otherOptions.acceptFiles).then(async (file: any) => {
              if (file && file.uri) {
                await this.helper.presentLoadingWithOptions('Processing file(s)...');
                const imageLists = [];
                const imgNotValid = [];
                this.validateFile(file.uri, otherOptions, imgNotValid, imageLists, 0, 1) .then((validatedImg: any) => {
                  return resolve(validatedImg);
                }).catch((validationErrImg) => {
                  return reject(validationErrImg);
                });
              } else {
                return reject('Canceled');
              }
            }).catch((error: any) => {
              return reject('Canceled');
            });
          }
        });
      }
      buttonsArray.push({
        icon: 'close',
        cssClass: 'icon',
        text: cancelText,
        role: 'cancel',
        handler: () => {
          return reject('Canceled');
        }
      });
      const actionSheet = await this.actionSheetCtrl.create({
        header: title,
        subHeader,
        buttons: buttonsArray
      });
      setTimeout(async () => {
        await actionSheet.present();
      }, 200);
    });
  }
  validateFile(imagePath, otherOptions, imgNotValid, imageLists, i = 0, arrLength = 1) {
    return new Promise(async (resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(imagePath).then((entry: any) => {
        (entry as FileEntry).file((file) => {
          const reader = new FileReader();
          let imgBlob: any = null;
          reader.onloadend = async () => {
            imgBlob = new Blob([reader.result], {type: file.type});
            if (Object.keys(otherOptions).length) {
              const inArrayFileType = _.findIndex(_.split((otherOptions.acceptFiles || FILE_VAR.ALLOWED_FILE_TYPE), ','), f => {
                return f.trim() === file.type;
              });
              if (inArrayFileType >= 0) {
                if (file.size > (otherOptions.maxFileSize || FILE_VAR.MAX_FILE_SIZE_DEFAULT)) {
                  imgNotValid.push({ invalidFile: file, err: VALIDATION_MSG.ERR_FILE_SIZE});
                } else {
                  imageLists.push({
                    fileTarget: imagePath,
                    fileName: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                    filePath: imagePath.substr(0, imagePath.lastIndexOf('/') + 1),
                    readFileSrc: (window as any).Ionic.WebView.convertFileSrc(imagePath),
                    myFile: file,
                    imgBlobs: imgBlob
                  });
                }
              } else {
                imgNotValid.push({ invalidFile: file, err: VALIDATION_MSG.ERR_FILE_TYPE});
              }
            } else {
              imageLists.push({
                fileTarget: imagePath,
                fileName: imagePath.substr(imagePath.lastIndexOf('/') + 1),
                filePath: imagePath.substr(0, imagePath.lastIndexOf('/') + 1),
                readFileSrc: (window as any).Ionic.WebView.convertFileSrc(imagePath),
                myFile: file,
                imgBlobs: imgBlob
              });
            }
            setTimeout(() => {
              if ((i + 1) === arrLength) {
                if (otherOptions && imgNotValid.length && !imageLists.length) {
                  const msg = (arrLength === 1) ? imgNotValid[0].err : VALIDATION_MSG.ERR_FILE_SIZE_AND_TYPE;
                  this.helper.presentNewToast(msg);
                  return reject(msg);
                } else if (imgNotValid.length && imageLists.length) {
                  const msg = (arrLength === 1) ? imgNotValid[0].err : VALIDATION_MSG.ERR_FILE_SIZE_AND_TYPE;
                  this.helper.presentNewToast(msg);
                  return resolve(imageLists);
                } else {
                  this.helper.dismissLoading();
                  return resolve(imageLists);
                }
              }
            }, 200);
          };
          reader.readAsArrayBuffer(file);
        });
      }).catch((e) => {
        if (e.message) {
          this.helper.presentNewToast(e.message);
        }
        this.helper.dismissLoading(); });
    });
  }
  getCameraPicture(options, otherOptions) {
    return new Promise(async (resolve, reject) => {
      this.camera.getPicture(options).then(async (imagePath) => {
        if (imagePath && imagePath.length) {
          await this.helper.presentLoadingWithOptions('Processing file(s)...');
          const imageLists = [];
          const imgNotValid = [];
          this.validateFile(imagePath, otherOptions, imgNotValid, imageLists, 0, 1) .then((validatedImg: any) => {
            return resolve(validatedImg);
          }).catch((validationErrImg) => {
            return reject(validationErrImg);
          });
        }
      }).catch(async (e) => {
        if (e === 20) { await this.helper.presentNewToast(VALIDATION_MSG.ERR_PERMISSION_ALLOW); }
        this.helper.setStatusBar();
      });
    });
  }
  imgPickerGetPic(multipleSelect: number = FILE_VAR.MULTIPLE_SELECT_DEFAULT, otherOptions = null) {
    return new Promise(async (resolve, reject) => {
      const options: ImagePickerOptions = {
        width: 2400,
        height: 2400,
        disable_popover: true,
        maximumImagesCount: multipleSelect
      };
      this.imagePicker.getPictures(options).then(async (multiImages) => {
        if (multiImages && multiImages.length) {
          await this.helper.presentLoadingWithOptions('Processing image(s)...');
          const imageLists = [];
          const imgNotValid = [];
          for (let i = 0; i < multiImages.length; i++) {
            this.validateFile(multiImages[i], otherOptions, imgNotValid, imageLists, i, multiImages.length) .then((validatedImg: any) => {
              return resolve(validatedImg);
            }).catch((validationErrImg) => {
              return reject(validationErrImg);
            });
          }
        }
      }).catch(() => {});
    });
  }

  downloadFile(url, myFileName = null) {
    this.platform.ready().then(async () => {
      if (this.platform.is('android')) {
        this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(status => {
          if (status.hasPermission) {
            this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(async status2 => {
              if (status2.hasPermission) {
                await this.fileDownload(url, myFileName);
              } else {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(async status3 => {
                  if (status3.hasPermission) {
                    await this.fileDownload(url, myFileName);
                  }
                });
              }
            });
          } else {
            this.androidPermissions.requestPermissions(
                [
                  this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
                  this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
                ]
            ).then(async status4 => {
              if (status4.hasPermission) {
                await this.fileDownload(url, myFileName);
              }
            });
          }
        });
      } else {
        await this.fileDownload(url, myFileName);
      }
    }).catch(() => {});
  }
  async fileDownload(url, myFileName = null) {
    const fileName = myFileName ? myFileName : url.substring(url.lastIndexOf('/') + 1);
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.helper.presentLoadingWithOptions('Please wait...').catch(() => {});
    let targetPath: string;
    let targetPathDir: string;
    if (this.platform.is('android')) {
      targetPathDir = this.file.externalRootDirectory + '/Download/';
      targetPath = targetPathDir + fileName;
    } else {
      targetPathDir = this.file.dataDirectory;
      targetPath = targetPathDir + fileName;
    }
    this.file.checkFile(targetPathDir, fileName).then(async (isFileExist: any) => {
      await this.fileOpenToast(targetPath, fileName);
    }).catch((e) => {
      fileTransfer.download(url, targetPath, true).then(async (entryUrl) => {
        await this.fileOpenToast(entryUrl.toURL(), fileName);
      }, async () => {
        await this.helper.presentNewToast(FILE_VAR.ERROR_FILE_DOWNLOAD);
      });
      fileTransfer.onProgress((progressEvent) => {
        this.helper.loading.message = 'Downloading...' + Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%';
      });
    });
  }
  openFile(filePath) {
    this.file.resolveLocalFilesystemUrl(filePath).then((entry: FileEntry) => {
      entry.file (success => {
        const mimeType = success.type;
        this.fileOpener.open(filePath, mimeType).catch(async e => {
          if (e.status === 9) {
            await this.helper.presentNewToast(FILE_VAR.ERROR_NO_FILE_APP);
          } else {
            await this.helper.presentNewToast(FILE_VAR.ERROR_OPENING_FILE);
          }
        });
      }, error => {
        // no mime type found;
      });
    }).catch(() => {});
  }
  async fileOpenToast(url, fileName = 'File') {
    this.helper.dismissLoading();
    const toast = await this.toastCtrl.create({
      header: '', // fileName,
      message: 'File' + FILE_VAR.SUCCESS_FILE_BEEN_DOWNLOAD, // '' + VARS.SUCCESS_FILE_BEEN_DOWNLOAD,
      position: 'bottom',
      cssClass: 'openFileToast',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'btnCancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Open',
          cssClass: 'btnOpen',
          handler: () => {
            this.openFile(url);
          }
        }
      ]
    });
    setTimeout(() => {
      this.helper.dismissLoading();
      toast.present();
    }, 200);
  }
}
