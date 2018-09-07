import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {catchError, retry} from 'rxjs/operators';
import {ResponseModel} from '../models/response.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Datas} from '../models/datas.model';
import {CONF} from '../app/app.config';
import {ApiDataService, G} from './data-store.service';
import {CustomQueryEncoderHelper, Utils} from './utilities.service';

/**
 * Request options
 * url & data
 */
class AjaxOptions {
  public url: string;
  public datas: any;

  constructor(
    private path: string,
    private _datas: Datas,
    private isGet: boolean = false,
    private host?: string | boolean
  ) {
    this.init();
  }

  private init() {
    // not false
    // is '' or undefined or null or 0
    this.url = CONF.ApiData.ServiceHost + this.path;
    if (this.host) {
      // not empty string
      this.url = this.host + this.path;
    }
    if (this.host === false) {
      // without host
      this.url = this.path;
    }
    const datas: Datas = {
      ClientType: CONF.ApiData.ClientType,
      Token: CONF.ApiData.Token
    };

    // 处理undefined
    for (const i in this._datas) {
      if (this._datas.hasOwnProperty(i)) {
        if (this._datas[i] === undefined) {
          delete this._datas[i];
        }
      }
    }

    Object.assign(datas, this._datas);

    if (!this.isGet) {
      const _date = new Date(Date.parse(new Date().toString()) + CONF.ApiData.DiffTime);
      datas.TimeSpan = Utils.dateTimeFormat(_date, 'yyyy-MM-dd hh:mm:ss');
    }

    const preparedParams = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: datas
    });

    if (this.isGet) {
      this.datas = { params: preparedParams };
    } else {
      this.datas = preparedParams;
    }
  }
}

/**
 * Async http request
 * get() & post()
 */
@Injectable()
export class Ajax {
  private host: string | boolean;

  constructor(
    private http: HttpClient,
    private apiDataService: ApiDataService
  ) { }

  /**
   * Http get request
   * @param {string} path
   * @param {Datas} datas
   * @param {number} retries
   * @param {string | boolean} host
   * @returns {Observable<any>}
   */
  public get(path: string, datas: Datas = {}, retries: number = 0, host?: string | boolean): Observable<any> {
    this.host = host;
    const options = new AjaxOptions(path, datas, true, host);
    return Observable.create(observer => {
      this.http.get<ResponseModel>(options.url, options.datas)
        .pipe(
          retry(retries),
          catchError(this.handleError)
        )
        .subscribe(
          (response: ResponseModel) => {
            this.next(observer, response);
          },
          error => {
            observer.error(error);  // request error
          },
          () => {
            observer.complete('Completed');
          }
        );
    });
  }

  /**
   * Http post request
   * @param {string} path
   * @param {Datas} datas
   * @param {number} retries
   * @param {string | boolean} host
   * @returns {Observable<any>}
   */
  public post(path: string = '', datas: Datas = {}, retries: number = 0, host?: string | boolean): Observable<any> {
    this.host = host;
    const options = new AjaxOptions(path, datas, false, host);
    return Observable.create(observer => {
      this.http.post<ResponseModel>(options.url, options.datas)
        .pipe(
          retry(retries),
          catchError(this.handleError)
        )
        .subscribe(
          (response: ResponseModel) => {
            this.next(observer, response);
          },
          error => {
            observer.error(error);  // request error
          },
          () => {
            observer.complete();
          }
        );
    });
  }

  /**
   * Response success handler
   * Include background biz error
   * @param {ResponseModel} result
   * @returns {boolean}
   */
  private handleSuccess(result: ResponseModel) {
    let isSuccess = false;
    if (this.host || this.host === false) {
      // custom host or without host
      isSuccess = true;
    } else {
      switch (result.ResultCode) {
        case '-1':
          // 服务器错误
          // 清除token信息
          this.apiDataService.Clear();
          this.apiDataService.Init();
          // 清除登录信息
          this.apiDataService.ClearLogin();
          break;
        case '0':
          // 成功
          isSuccess = true;
          break;
        default:
          break;
      }
    }
    return isSuccess;
  }

  /**
   * Response failed handler
   * Network/server error mostly
   * @param {HttpErrorResponse} error
   * @returns {ErrorObservable}
   */
  private handleError(error: HttpErrorResponse): ErrorObservable {
    if (error.error instanceof ErrorEvent) {
      console.error(`An error occurred: ${error.error.message}`);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error, 'error was: ', error);
    }

    return new ErrorObservable(`Something bad happend, please try again later.`);
  }

  private next(observer: any, res: ResponseModel) {
    const handleResult = this.handleSuccess(res);
    if (!handleResult) {
      let msg = res.Message || '请求错误';
      if (res.Data && typeof res.Data === 'object' && res.Data.length) {
        if (res.Data[0] && res.Data[0].Message && res.Data[0].Key) {
          msg = (`${res.Data[0].Message}(${res.Data[0].Key})`) || '请求错误';
        }
      }

      observer.error({ msg: msg, res: res });
    } else {
      if (this.host || this.host === false) {
        observer.next(res);
        return;
      }
      observer.next(res.Data);
    }
  }

  private alertError(result: any = {}, addonMsg: string = '请稍后再试') {
    let _msg = '发生错误';
    if (result.Data) {
      if (typeof result.Data === 'object' && result.Data.length) {
        _msg = result.Data[0].Message;
      }
      if (typeof result.Data === 'string') {
        _msg = result.Data;
      }
    } else {
      _msg = result.Message;
    }

    console.warn(_msg);
  }
}
