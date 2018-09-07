import {Injectable} from '@angular/core';
import {Ajax} from '../ajax.service';

@Injectable()
export class UserInfoService {
  constructor(private ajax: Ajax) { }

  /**
   * 用户信息
   * @returns {Observable<any>}
   * @constructor
   */
  Info() {
    return this.ajax.post('UserInfo/Info');
  }

  /**
   * 用户头像
   * @returns {Observable<any>}
   * @constructor
   */
  HeadImg() {
    return this.ajax.post('UserInfo/HeadImg');
  }
}
