import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {CheckboxComponent} from './checkbox/checkbox.component';
import {DropDialogComponent} from './drop-dialog/drop-dialog.component';
import {SwitchComponent} from './switch/switch.component';
import {CarouselComponent} from './carousel/carousel.component';
import {ThemeBtnComponent} from './theme-btn/theme-btn.component';
import {AlertDialogComponent} from './alert-dialog/alert-dialog.component';


@NgModule({
  declarations: [
    DropDialogComponent,
    SwitchComponent,
    CarouselComponent,
    ThemeBtnComponent,
    CheckboxComponent,
    AlertDialogComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    DropDialogComponent,
    SwitchComponent,
    CarouselComponent,
    ThemeBtnComponent,
    CheckboxComponent,
    AlertDialogComponent
  ]
})
export class MyComponentsModule { }
