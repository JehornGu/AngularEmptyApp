import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {IndexComponent} from '../views/index/index/index.component';

const APP_ROUTES: Routes = [
  { path: '', component: IndexComponent },
  { path: 'account', loadChildren: 'views/account/account.module#AccountModule' }
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
