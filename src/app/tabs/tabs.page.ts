import {Component } from '@angular/core';
import {IMGS, STORAGE_GET_DATA, USER_TYPES} from '../app-constants.service';
import {AuthService} from '../core/auth/auth.service';
import {HelperService} from '../Services/Helper/helper.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  _UT = USER_TYPES; _IMG = IMGS;
  userType: any; selectedTab = 'Jobs';
  constructor(private auth: AuthService,
              private helper: HelperService) {
    this.auth.authState$.subscribe(state => {
      if (state === true) {
        this.auth.getSavedUser(STORAGE_GET_DATA.USER_ROLE).then((userType) => {
          this.userType = userType;
        }).catch(() => {});
      } else if (state === false) {
        this.userType = null;
      }
    });
    this.helper.navParams().then((params: any) => {
      if (params) {
        this.selectedTab = params.selectedTab;
      }
    }).catch(() => {});
  }
}
