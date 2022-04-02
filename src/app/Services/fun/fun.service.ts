import { Injectable } from '@angular/core';
import {USER_TYPES} from '../../app-constants.service';

@Injectable({
  providedIn: 'root'
})
export class FunService {
  constructor() { }
  getUserTypeChip(ut) {
    const _UT = USER_TYPES;
    if (ut === _UT.CLIENT || ut === _UT.SUPPLIER) {
      return null;
    } else if (ut === _UT.CONTRACTOR) {
      return 'Contractor';
    } else if (ut === _UT.AGENT) {
      return 'Project Manager';
    } else if (ut === _UT.HEAD_CONTRACTOR) {
      return 'Houseace';
    }
  }
  getQBtnTxt(ut) {
    const _UT = USER_TYPES;
    if (ut === _UT.CLIENT) {
      return 'See Quotes';
    } else if (ut === _UT.CONTRACTOR) {
      return 'All Quotes';
    } else if (ut === _UT.SUPPLIER) {
      return 'Your Projects';
    } else {
      // AGENT, HEAD_CONTRACTOR
      return 'Manage Quotes';
    }
  }
}
