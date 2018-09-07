import {Injectable} from '@angular/core';
import {Utils} from '../utilities.service';

@Injectable()
export class ConfigService {
  constructor() { }

  /**
   * 请求配置数据
   * @returns {Observable<any>}
   */
  conf() {
    const URL = '/assets/datas/config.json';
    return Utils.xmlHttpRequest(URL, {}, 'GET', false);
  }
}
