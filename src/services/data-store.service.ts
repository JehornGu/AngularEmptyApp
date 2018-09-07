import {Injectable} from '@angular/core';
import {CONF} from '../app/app.config';
import {Utils} from './utilities.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {ConfigService} from './common/config.service';
import {CookieService} from 'ngx-cookie';
import {ESex, EUserType} from '../models/user-info.model';

/**
 * @Object Public enumeration
 */
export const G = {
  COOKIES: {
    TOKEN: 'cyaninValleyToken',
    USER_INFO: 'cyaninValleyUserInfo',
    USER_HEAD_IMG: 'cyaninValleyUserImg'
  }
};

/**
 * @Class Cookie&data init
 */
@Injectable()
export class ApiDataService {
  public diffTime: number;
  public token: string;

  constructor(
    private cookieService: CookieService,
    private configService: ConfigService
  ) { }

  /**
   * 初始化配置
   * @constructor
   */
  InitConfig() {
    this.configService.conf().subscribe(data => {
      const configuration = JSON.parse(data);

      CONF.ApiData.ServiceHost = configuration.ServiceHost;
    });
  }

  /**
   * 初始化Token
   * @returns {Observable<string>}
   * @constructor
   */
  Init() {
    const tokenAndTime = this.cookieService.get(G.COOKIES.TOKEN);

    if (!Utils.nullOrEmpty(tokenAndTime)) {
      const obj = JSON.parse(tokenAndTime);
      this.diffTime = obj.diffTime;
      this.token = obj.token;
      CONF.ApiData.Token = obj.Token;
      CONF.ApiData.DiffTime = obj.diffTime;
    } else {
      // 同步获取
      this.Token().subscribe(data => {
        if (data) {
          const _data = JSON.parse(data).Data;
          const diffTime = Date.parse(_data.Time.toString()) - Date.parse(new Date().toString());
          _data.diffTime = diffTime;
          this.cookieService.put(G.COOKIES.TOKEN, JSON.stringify(_data), { path: '/' });
          this.diffTime = diffTime;
          this.token = _data.Token;
          CONF.ApiData.Token = _data.Token;
          CONF.ApiData.DiffTime = diffTime;
        }
      });
    }

    return Observable.of(this.token);
  }

  /**
   * 获取Timespan
   * @returns {Date}
   * @constructor
   */
  GetTimespan() {
    const v = Date.parse(new Date().toString()) + this.diffTime;
    return new Date(parseInt(v.toString(), 10));
  }

  /**
   * 请求token
   * @returns {Observable<any>}
   * @constructor
   */
  Token() {
    const URL = `${CONF.ApiData.ServiceHost}Token/ApplyAndTime`;
    return Utils.xmlHttpRequest(URL, {}, 'POST', false);
  }

  /**
   * 清除token
   * @constructor
   */
  Clear() {
    this.cookieService.put(G.COOKIES.TOKEN, '', { path: '/' });
    this.token = '';
    this.diffTime = 0;
  }

  /**
   * 清除登录信息
   * @returns {any}
   * @constructor
   */
  ClearLogin() {
    this.cookieService.put(G.COOKIES.USER_INFO, '', { path: '/' });
    window.localStorage.removeItem(G.COOKIES.USER_HEAD_IMG);
    this.ClearConf();
  }

  /**
   * 清除CONF对象
   */
  ClearConf() {
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
