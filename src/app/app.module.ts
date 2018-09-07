import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CookieModule, CookieService} from 'ngx-cookie';
import {Observable} from 'rxjs/Observable';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { MyDirectives } from '../directives';
import { MyPipesModule } from '../pipes';
import { MyComponentsModule } from '../views/shared/global-components.module';
import { MyHttpInterceptorProviders } from '../http-interceptors';

import {Ajax} from '../services/ajax.service';
import {ConfigService} from '../services/common/config.service';
import {ApiDataService} from '../services/data-store.service';
import {UserDataService} from '../services/data-user.service';
import {UserInfoService} from '../services/account/user-info.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from '../views/shared/header/header.component';
import { FooterComponent } from '../views/shared/footer/footer.component';


export function AppInit(apiDataService: ApiDataService, userDataService: UserDataService) {
  apiDataService.InitConfig(); // 初始化配置数据
  apiDataService.Init(); // 初始化token
  userDataService.Init(); // 初始化用户信息
  return () => Observable.of([]);
}


@NgModule({
  declarations: [
    AppComponent,
    MyDirectives,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    HttpClientModule,
    CookieModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MyPipesModule,
    MyComponentsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    MyHttpInterceptorProviders,
    Ajax,
    CookieService,
    ConfigService,
    ApiDataService,
    UserDataService,
    UserInfoService,
    { provide: APP_INITIALIZER, useFactory: AppInit, deps: [ApiDataService, UserDataService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
