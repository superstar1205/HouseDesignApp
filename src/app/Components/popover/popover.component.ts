import {Component, Input} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
  @Input() popOverBtns = [];
  constructor(private popoverCtrl: PopoverController) {
  }
  dismissPopover(type) {
    this.popoverCtrl.dismiss({closeType: type}).catch(() => {});
  }
}
