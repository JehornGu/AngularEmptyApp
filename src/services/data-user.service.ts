import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {G} from './data-store.service';
import {Utils} from './utilities.service';
import {CONF} from '../app/app.config';
import {Observable} from 'rxjs/Observable';
import {UserInfoService} from './account/user-info.service';
import {ESex, EUserType, UserInfoModel} from '../models/user-info.model';

@Injectable()
export class UserDataService {
  constructor(
    private cookieService: CookieService,
    private userInfoService: UserInfoService
  ) { }

  /**
   * 初始化
   * @constructor
   */
  Init() {
    const _userInfo = this.cookieService.get(G.COOKIES.USER_INFO);
    if (!Utils.nullOrEmpty(_userInfo)) {
      const userInfo = JSON.parse(_userInfo);
      this.setConf(userInfo);
      return;
    }

    CONF.UserData.IsLogin = false;
  }

  /**
   * 获取用户信息 持久化数据
   * @constructor
   */
  LocalizationData() {
    return Observable.create(observer => {
      this.userInfoService.Info().subscribe(data => {
        if (data) {
          this.cookieService.put(G.COOKIES.USER_INFO, JSON.stringify(data), { path: '/' });

          this.setConf(data);
          observer.next(data);

          return;
        }

        observer.error('获取用户信息失败,请重新登录');
      });
    });
  }

  /**
   * 清除登录信息
   * @returns {any}
   * @constructor
   */
  Clear() {
    return Observable.create(observer => {
      this.cookieService.put(G.COOKIES.USER_INFO, '', { path: '/' });
      window.localStorage.removeItem(G.COOKIES.USER_HEAD_IMG);
      this.clearConf();

      observer.next();
    });
  }

  /**
   * 更新本地存储用户信息
   * @param newInfo
   * @constructor
   */
  Update(newInfo: UserInfoModel) {
    const _userInfo = this.cookieService.get(G.COOKIES.USER_INFO);
    const obj = JSON.parse(_userInfo);

    for (const i in obj) {
      if (obj.hasOwnProperty(i) && newInfo.hasOwnProperty(i)) {
        obj[i] = newInfo[i];
      }
    }

    this.setConf(newInfo);
  }

  /**
   * 为全局属性赋值
   * @param {UserInfoModel} data
   */
  private setConf(data: UserInfoModel) {
    CONF.UserData.NickName = data.NickName;
    CONF.UserData.UserType = data.UserType;
    CONF.UserData.Phone = data.Phone;
    CONF.UserData.Email = data.Email;
    CONF.UserData.Level = data.Level;
    CONF.UserData.Address = data.Address;
    CONF.UserData.Sex = data.Sex;

    CONF.UserData.AuthEmail = data.AuthEmail;
    CONF.UserData.IsLogin = true;
  }

  /**
   * 清除CONF对象
   */
  private clearConf() {
    CONF.UserData.NickName = '';
    CONF.UserData.Sign = '';
    CONF.UserData.UserType = EUserType.Visitor;
    CONF.UserData.Phone = '';
    CONF.UserData.Email = '';
    CONF.UserData.Level = 0;
    CONF.UserData.Address = '';

    CONF.UserData.Sex = ESex.UnKnow;
    CONF.UserData.AuthEmail = false;
    CONF.UserData.IsLogin = false;
  }
}
