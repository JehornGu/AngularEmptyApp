# Angular新建项目步骤记录

标签（空格分隔）： Angular

---

##### 1. `ng new my-app`
##### 2. 启动dev环境

```
cd my-app
ng serve --open
```

##### 3. 修改`styles.css`为`styles.scss`,同时修改文件 .angular-cli.json 中的：

```
...
      "styles": [
        "styles.scss"
      ],
...
```

重新打包。

##### 4. 配置全局样式

* /src 目录下添加`./scss`文件夹
* /scss 目录下添加`./mixins`,`./utilities`文件夹，添加`_mixins.scss`(混合), `_reboot.scss`(重置浏览器), `_utilities.scss`(工具), `_variables.scss`(变量)。
* 在`/src/styles.scss`文件中引用以上：

```
/**
 * Global styles
 */

@import "scss/_variables.scss";
@import "scss/_mixins.scss";
@import "scss/_reboot.scss";
@import "scss/_utilities.scss";
```

* 添加`font-awesome`:

```
npm i --save font-awesome
```

然后在`.angularcli.json`中添加：

```
...
"apps": [{
    ...
    "styles": [
        "styles.scss",
        "../node_modules/font-awesome/scss/font-awesome.scss"
    ],
    ...
}],
...
```


* 还可以去iconmoon等网站定制自己的icon字体，

将字体文件放在`assets`目录下，这时候**引用字体文件的时候，需要将路径设置为绝对路径**,[参见](https://github.com/angular/angular-cli/issues/5213#issuecomment-284783844)。最后在`style.scss`文件import即可。

##### 5. 配置全局变量管理，应用初始化，懒加载

* 我们使用cookie进行本地信息管理，所以需要先安装`ngx-cookie`：

```
npm i --save ngx-cookie
```

然后在`app.module.ts`中：

```
...
@NgModule({
    ...
    imports: [
        CookieModule.forRoot(),
    ],
    providers: [
        CookieService
    ]
    ...
})
...
```

* 配置全局变量和数据管理服务。

添加`src/services`文件夹，添加`ajax.service.ts`(XHR封装),`data-store.service.ts`(全局枚举/属性以及接口初始化服务和配置初始化),`data-user.service.ts`(用户账户操作信息管理服务), `utilities.service.ts`(静态工具类/公共工具)。

在/src/app/中添加`app.config.ts`,用于保存全局变量。添加`app-routing.module.ts`用于单独配置应用的路由以及路由懒加载。

```
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {IndexComponent} from '../views/index/index/index.component';

const APP_ROUTES: Routes = [
  { path: '', component: IndexComponent }
];

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    RouterModule.forRoot(APP_ROUTES, { useHash: Boolean(history.pushState) === false })
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }
```

* 设置应用初始化

在`app.module.ts`中调用数据初始化：

```
...
export function AppInit(apiDataService: ApiDataService, userDataService: UserDataService) {
  apiDataService.InitConfig(); // 初始化配置数据
  apiDataService.Init(); // 初始化token
  userDataService.Init(); // 初始化用户信息
  return () => Observable.of([]);
}

@Ngmodule({
    ...
    providers: [
        ...
        ApiDataService,
        UserDataService,
        { provide: APP_INITIALIZER, useFactory: AppInit, deps: [ApiDataService, UserDataService], multi: true }
        ...
    ]
    ...
})
```

* lazyload模块

比如我们有一个账号登录`account.module.ts`。实现懒加载需要在`app-routing.module.ts`中这样引用：

```
...
const APP_ROUTES: Routes = [
  { path: '', component: IndexComponent },
  { path: 'account', loadChildren: 'views/account/account.module#AccountModule' } // 实现懒加载
];

@NgModule({
    declarations: [
        IndexComponent
    ],
    imports: [
        RouterModule.forRoot(APP_ROUTES, { useHash: Boolean(history.pushState) === false })
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class AppRoutingModule { }
```

在浏览器中，当出现`account.module.chunk.js`的js加载就表示成功了：

![lazyload](https://images2018.cnblogs.com/blog/1012606/201809/1012606-20180907113924975-1679861016.gif)

##### 6. 其他

* 应用加载显示

应用首次进入的时候会有白屏。可以添加一些loading动画使加载过程有更好的用户体验。
打开根目录下的`index.html`,可以在`app-root`中填入任何代码：

```
...
<body>
  <app-root>
    <style>
      app-root {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;

        color: #F4D8D9;
        text-transform: uppercase;
        font-family: -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Oxygen-Sans,
        Ubuntu,
        Cantarell,
        Helvetica,
        sans-serif;
        font-size: 25px;
        text-shadow: 2px 2px 10px rgba(0,0,0,0.2);
      }
      body {
        background: #21ABA5;
        margin: 0;
        padding: 0;
      }

      @keyframes dots {
        50% {
          transform: translateY(-.4rem);
        }
        100% {
          transform: translateY(0);
        }
      }

      .d {
        animation: dots 1.5s ease-out infinite;
      }
      .d-2 {
        animation-delay: .5s;
      }
      .d-3 {
        animation-delay: 1s;
      }
    </style>

    Loading<span class="d">.</span><span class="d d-2">.</span><span class="d d-3">.</span>
  </app-root>
</body>
</html>
```

> 参见<a href="https://www.cnblogs.com/jehorn/p/9603781.html" target="_blank" style="color:#21ABA5;font-weight:600;">博客园</a>。纯属个人见解，如有错误疏漏之处望不吝赐教。