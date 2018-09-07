import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {CONF} from '../app/app.config';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // Set request Content-Type
    const authReq = req.clone({ setHeaders: { 'Content-Type': CONF.ApiData.ContentType } });

    return next.handle(authReq);
  }
}
