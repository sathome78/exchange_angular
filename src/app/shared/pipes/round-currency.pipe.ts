import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import prettyNum from 'pretty-num';

@Pipe({
  name: 'roundCurrency',
})
export class RoundCurrencyPipe implements PipeTransform {

  constructor(
    private utils: UtilsService,
  ) {}

  transform(value: string, currencyName: string = ''): string | number {
    const num = prettyNum(value);
    if (num) {
      if (this.utils.isFiat(currencyName)) {
        return this.sliceFraction(num, 2);
      }
      return this.sliceFraction(num, 8);
    }
    return '';

  }

  sliceFraction(value: string, count: number): string {
    const index = value.indexOf('.');
    if (index >= 0) {
      return value.substr(0, index + 1 + count);
    }
    return value;
  }

}
