import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './account.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MyComponentsModule} from '../shared/global-components.module';
import {SignUpComponent} from './sign-up/sign-up.component';
import {ResetPassComponent} from './reset-pass/reset-pass.component';

const ROUTES: Routes = [{
  path: '',
  component: AccountComponent,
  children: [{
    path: '',
    children: [
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'reset-pass', component: ResetPassComponent },
      { path: '**', component: SignInComponent }
    ]
  }]
}];

@NgModule({
  declarations: [
    AccountComponent,
    SignInComponent,
    SignUpComponent,
    ResetPassComponent
  ],
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    FormsModule,
    MyComponentsModule
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AccountRoutingModule { }
