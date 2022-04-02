import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {HelperService} from '../../Services/Helper/helper.service';
import {PopoverComponent} from '../popover/popover.component';

@Component({
  selector: 'app-more-button',
  templateUrl: './more-button.component.html',
  styleUrls: ['./more-button.component.scss'],
})
export class MoreButtonComponent implements OnInit {
  @Input() myPopBtns = [];
  @Input() isDisabled = false;
  @Input() isAnyDotTrue = false;
  @Output() onButtonTrigger = new EventEmitter<any>();
  constructor(private popoverCtrl: PopoverController,
              public helper: HelperService) { }
  ngOnInit() {}
  async openPopOver(ev = null) {
    this.helper.onScrollCloseKeyBoard();
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps: {
        popOverBtns: this.myPopBtns
      },
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then((popData) => {
      if (popData.data && popData.data.closeType) {
        this.onButtonTrigger.emit({buttonClicked: popData.data.closeType});
      }
    }).catch(() => {
    });
    return await popover.present();
  }
}
