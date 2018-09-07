import {Injectable} from '@angular/core';
import {Ajax} from '../ajax.service';

@Injectable()
export class CommonService {
  constructor(private ajax: Ajax) { }

  /**
   * Nav datas
   */
  public navMenu() {
    const URL = 'assets/datas/nav-data.json';
    return this.ajax.get(URL, {}, 1, false);
  }
}
