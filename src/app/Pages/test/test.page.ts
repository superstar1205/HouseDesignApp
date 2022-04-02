import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../Services/modal/modal.service';
import {StaticService} from '../../Services/static/static.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  data = [
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-71.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-71-150x150.jpg',
      title: 'download-71'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-72.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-72-150x150.jpg',
      title: 'download-72'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-73.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-73-150x150.jpg',
      title: 'download-73'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-75.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-75-150x150.jpg',
      title: 'download-75'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/cdv_photo_007.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/cdv_photo_007-150x135.jpg',
      title: 'cdv_photo_007'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-76.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-76-150x150.jpg',
      title: 'download-76'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-77.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-77-150x150.jpg',
      title: 'download-77'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-78.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-78-150x150.jpg',
      title: 'download-78'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-79.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-79-150x150.jpg',
      title: 'download-79'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-80.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-80-150x150.jpg',
      title: 'download-80'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-81.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-81-150x150.jpg',
      title: 'download-81'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-82.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-82-150x150.jpg',
      title: 'download-82'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-83.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-83-150x150.jpg',
      title: 'download-83'
    },
    {
      link: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-84.jpg',
      thumbnail: 'http://houseace.staging.wpengine.com/wp-content/uploads/2020/01/download-84-150x150.jpg',
      title: 'download-84'
    }
  ]; sf;
  constructor(private modalService: ModalService) {
    this.sf = StaticService.getThisInputForm();
    // this.modalService.onViewFile(this.data, 0, 'link');
  }

  ngOnInit() {
  }

}
