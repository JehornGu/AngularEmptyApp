import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from '../services/utilities.service';

@Pipe({ name: 'moneyUnit' })
export class MoneyUnitPipe implements PipeTransform {
  private value: number;
  private fixed: number;

  transform(value: number | string, fixed: number = 2) {
    this.value = +value;
    this.fixed = fixed;

    if (!value) {
      this.value = 0;
      return this.format();
    }

    if (value >= 100000000) {
      return this.format(100000000, '亿');
    }
    if (value >= 10000) {
      return this.format(10000, '万');
    }

    return this.format();
  }

  private format(unit = 1, addon = '') {
    const money = this.value / unit;
    const str = Utils.moneyFormat(money, this.fixed);
    return (str + addon);
  }
}
