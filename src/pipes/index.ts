import {NgModule} from '@angular/core';
import {TrimPipe} from './trim.pipe';
import {MoneyUnitPipe} from './money-unit.pipe';

@NgModule({
  declarations: [
    TrimPipe,
    MoneyUnitPipe
  ],
  exports: [
    TrimPipe,
    MoneyUnitPipe
  ]
})
export class MyPipesModule { }
