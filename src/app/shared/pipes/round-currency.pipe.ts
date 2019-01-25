import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../services/utils.service';

@Pipe({
  name: 'roundCurrency'
})
export class RoundCurrencyPipe implements PipeTransform {

  constructor(
    private utils: UtilsService
  ) {}

  transform(value: number, currencyName: string = ''): string {
    if (value) {
      let rounded: number | string;
      if (this.utils.isFiat(currencyName)) {
        rounded = this.checkFraction(value.toString(), 2) ? ((Math.floor(value * 100)) / 100) : value;
      } else {
        rounded = this.checkFraction(value.toString(), 8) ? ((Math.floor(value * 100000000)) / 100000000) : value;
      }
      return '' + rounded;
    } else {
      return '';
    }
  }

  checkFraction(value: string, count: number): boolean {
    const parts = value.split('.');
    return parts[1] ? +parts[1].length > count ? true : false : false;
  }

  // transform(value: number, isFiat: boolean): string {
  //   let rounded: number | string;
  //   if (isFiat) {
  //     rounded = ((Math.floor(value * 100)) / 100);
  //   } else {
  //     rounded = ((Math.floor(value * 100000000)) / 100000000);
  //   }
  //   const numParts = ('' + rounded).split('.');
  //   if (numParts.length === 1) {
  //     rounded = rounded.toFixed(1);
  //   } else {
  //     const fractPartLength = numParts[1].length;
  //     rounded = rounded.toFixed(fractPartLength);
  //   }
  //   return '' + rounded;
  // }

}
