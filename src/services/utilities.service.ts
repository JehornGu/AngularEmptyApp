import {Datas} from '../models/datas.model';
import {Observable} from 'rxjs/Observable';
import {CONF} from '../app/app.config';
import {HttpParameterCodec, HttpParams} from '@angular/common/http';
import 'rxjs/add/observable/timer';

/**
 * 静态工具类
 * @function xmlHttpRequest http请求
 * @function getUrlParam    获取url参数
 * @function notNullOrEmpty 字符串非空
 */
export class Utils {

  /**
   * @static Http request
   * @param {string} url
   * @param {Datas} data
   * @param {string} type
   * @param {boolean} async
   * @returns {Observable<any>}
   */
  public static xmlHttpRequest(url: string, data: Datas = {}, type: string = 'POST', async: boolean = true): Observable<any> {
    let params = new HttpParams();
    const xhr = new XMLHttpRequest();
    data.ClientType = CONF.ApiData.ClientType;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.set(key, data[key]);
      }
    }

    xhr.open(type, url, async);
    if (async) {
      xhr.timeout = 10000;
    }
    xhr.setRequestHeader('Content-Type', CONF.ApiData.ContentType);

    return Observable.create(observer => {
      xhr.onload = function () {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          observer.next(xhr.response, xhr);
        } else {
          observer.error(xhr.response, xhr.status, xhr);
        }
        observer.complete();
      };

      xhr.ontimeout = function () {
        observer.error('Request timeout!');
      };

      xhr.onerror = function (e) {
        observer.error('A network error occurred!');
      };

      try {
        xhr.send(params);
      } catch (e) {
        console.warn('XHR request failed!');
        console.warn(e);
      }
    });
  }

  /**
   * 获取url参数
   * @param {string} key
   * @returns {any}
   */
  public static getUrlParam(key: string) {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    const r = window.location.search.substr(1).match(reg);
    if (r !== null) {
      return decodeURIComponent(r[2]);
    }
    return null;
  }

  /**
   * 字符串空
   * @param {string} str
   * @returns {boolean}
   */
  public static nullOrEmpty(str: string) {
    if (str === undefined || str === null || str === '') {
      return true;
    }
    return false;
  }

  /**
   * 日期格式化
   * @param {Date} datetime
   * @param {string} format
   * @returns {string}
   */
  public static dateTimeFormat(datetime: Date, format: string = 'yyyy-MM-dd') {
    const date = {
      'M+': datetime.getMonth() + 1,
      'd+': datetime.getDate(),
      'h+': datetime.getHours(),
      'm+': datetime.getMinutes(),
      's+': datetime.getSeconds(),
      'q+': Math.floor((datetime.getMonth() + 3) / 3),
      'S+': datetime.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
      }
    }
    return format;
  }

  /**
   * 格式化日期字符串 必须包含T分隔符
   * @param {string} str
   * @returns {Date}
   */
  public static parseDateTimeStr(str: string) {
    const date = str.split('T')[0].split('-');
    const time = str.split('T')[1].split(':');
    const year = parseInt(date[0], 10);
    const month = parseInt(date[1], 10) - 1;
    const day = parseInt(date[2], 10);
    const hour = parseInt(time[0], 10);
    const minute = parseInt(time[1], 10);
    const second = parseInt(time[2], 10);
    return new Date(year, month, day, hour, minute, second);
  }

  /**
   * 格式化base64图片
   * @param {string} value
   * @param {string} format
   * @returns {string}
   */
  public static showBase64(value: string, format: string = 'png') {
    const array = [];
    array.push(`data:image/${format};base64`);
    array.push(value);
    const result = array.join();
    return result;
  }

  /**
   * 格式化base64字符
   * @param src
   * @returns {any}
   */
  public static formatBase64(src) {
    src += '';
    return src.replace(/^data:image\/((?:jpeg)|(?:jpg)|(?:png)|(?:gif))[;]base64,\s*/, '');
  }

  /**
   * 倒计时
   * @param {number} seconds 倒计时总秒数
   * @param {number} period  时间间隔
   * @param {number} delay   计时延迟
   * @returns {any}
   */
  public static countDown(seconds: number = 60, period: number = 1000, delay: number = 0) {
    let isCanStart = false;

    return Observable.create(observer => {
      const subscription = Observable.timer(delay, period).subscribe(s => {
        const _s = seconds - s;
        const countDownSeconds = _s < 10 ? ('0' + _s) : ('' + _s);
        if (s >= seconds) {
          isCanStart = true;
          subscription.unsubscribe();
        }

        observer.next({ canStart: isCanStart, second: countDownSeconds, s: _s });
      });
    });
  }

  /**
   * 文件转base64
   * @param e
   * @returns {any}
   */
  public static file2Base64(e) {
    const self = this;
    const f = e.target.files[0];
    return Observable.create(observer => {
      if (f) {
        const reader = new FileReader();
        reader.onload = (file => {
          return function () {
            // base64
            const src = self.formatBase64(this.result);

            observer.next({src: src, result: this.result});
          };
        })(f);
        reader.readAsDataURL(f);
      } else {
        observer.next(null);
      }
    });

  }

  /**
   * 压缩base64
   * @param base64 源base64
   * @param {{compress: number; exp: string; size: number}} options
   * @returns {any}
   */
  public static compressBase64(base64, options: Datas = { compress: 0.92, exp: 'jpg', size: 1 }) {
    const exp = options.exp;
    let compress = +options.compress;
    compress = compress < 0 ? 0 : compress;
    compress = compress > 1 ? 1 : compress;
    let size = +options.size;
    size = size < 0.1 ? 0.1 : size;
    size = size > 1 ? 1 : size;

    return Observable.create(observer => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = base64;
      img.onload = function () {
        canvas.width = img.width * size;
        canvas.height = img.height * size;
        ctx.drawImage(img, 0, 0, img.width * size, img.height * size);
        const newBase64 = canvas.toDataURL('image/' + exp, compress);

        observer.next(newBase64);
      };
    });
  }

  /**
   * 字符长度转换
   * @param {number} bytes
   * @returns {string}
   */
  public static bytes2Size(bytes: number) {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1024;

    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(4) + ' ' + sizes[i];
  }

  /**
   * 金额格式化
   * @param {string | number} str
   * @param {number} n
   * @returns {string}
   */
  public static moneyFormat(str: string | number, n: number = 2) {
    n = n >= 0 && n <= 20 ? n : 2;
    str = parseFloat((str + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
    const l = str.split('.')[0].split('').reverse(), r = str.split('.')[1];
    let t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
    }
    if (n === 0 || r === undefined) {
      return t.split('').reverse().join('');
    } else {
      return t.split('').reverse().join('') + '.' + r;
    }
  }

  /**
   * 获取元素样式
   */
  public static getEleStyle(ele: any) {
    if (ele.currentStyle === undefined) {
      return getComputedStyle(ele);
    } else {
      return ele.currentStyle; // IE
    }
  }

  /**
   * 滚动事件
   * @param scrollCallback
   */
  public static windowScroll(scrollCallback = function (...args) {}): void {
    let x = window.pageXOffset, y = window.pageYOffset;
    let directionX = null, directionY = null;
    const direction: Datas = {};
    const offset: Datas = {};
    window.addEventListener('scroll', e => {
      if (window.pageXOffset >= x) {
        directionX = 'right';
      }
      if (window.pageXOffset < x) {
        directionX = 'left';
      }
      if (window.pageYOffset >= y) {
        directionY = 'down';
      }
      if (window.pageYOffset < y) {
        directionY = 'up';
      }
      x = window.pageXOffset;
      y = window.pageYOffset;
      offset.x = x;
      offset.y = y;
      direction.x = directionX;
      direction.y = directionY;
      scrollCallback(offset, direction);
    });
  }

  /**
   * 回到顶部
   */
  public static getScrollTop() {
    let scrollTop;
    if (typeof window.pageYOffset !== 'undefined') {
      scrollTop = window.pageYOffset;
    } else if (typeof document.compatMode !== 'undefined' && document.compatMode !== 'BackCompat') {
      scrollTop = document.documentElement.scrollTop;
    } else if (typeof document.body !== 'undefined') {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  }
}

/**
 * 解决http请求字符串中+号被替换为空格的问题
 */
export class CustomQueryEncoderHelper implements HttpParameterCodec {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }

  decodeKey(k: string): string {
    return decodeURIComponent(k);
  }

  decodeValue(v: string): string {
    return decodeURIComponent(v);
  }
}
