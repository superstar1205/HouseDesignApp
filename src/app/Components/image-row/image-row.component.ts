import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMGS} from '../../app-constants.service';
import {ModalService} from '../../Services/modal/modal.service';

@Component({
  selector: 'app-image-row',
  templateUrl: './image-row.component.html',
  styleUrls: ['./image-row.component.scss'],
})
export class ImageRowComponent implements OnInit {
  @Output() public onClickTrigger = new EventEmitter<any>();
  @Input() public canDelete = false;
  @Input() public showAllImgs = false;
  @Input() public imgKey = 'url';
  @Input() public imgTitleKey = null;
  @Input() public filesItems: any = [];
  _IMG = IMGS;
  slidesOptions = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2.5,
    spaceBetween: 5
  };
  constructor(private modalService: ModalService) {
  }
  ngOnInit() {}
  onClickBtn(type, data = null) {
    this.onClickTrigger.emit({type , data});
  }
  async onViewFile(i) {
    await this.modalService.onViewFile(this.filesItems, i, this.imgKey, this.imgTitleKey);
  }
}
