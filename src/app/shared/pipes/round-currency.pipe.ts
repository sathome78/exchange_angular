import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../services/utils.service';
import prettyNum from 'pretty-num';

@Pipe({
  name: 'roundCurrency'
})
export class RoundCurrencyPipe implements PipeTransform {

  constructor(
    private utils: UtilsService
  ) {}

  transform(value: string, currencyName: string = ''): string | number {
    const num = prettyNum(value);
    if (num) {
      let rounded: number | string;
      if (this.utils.isFiat(currencyName)) {
        rounded = this.checkFraction(num, 2) ? this.sliceFraction(num, 2) : num;
      } else {
        rounded = this.checkFraction(num, 8) ? this.sliceFraction(num, 8) : num;
      }
      return rounded;
    } else {
      return '';
    }
  }

  checkFraction(value: string, count: number): boolean {
    const parts = value.split('.');
    return parts[1] ? parts[1].length > count ? true : false : false;
  }

  sliceFraction(value: string, count: number): string {
    const parts = value.split('.');
    const fraction = parts[1].substr(0, count);
    return [parts[1], fraction].join('.');
  }

}
