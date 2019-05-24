import { Pipe, PipeTransform } from '@angular/core';
import * as _reduce from 'lodash/reduce';

/**
 * Pipe to split currency pair to separate currencies
 * @param {string} value example BTC/USD
 * @param {number} arg example 1 or 2 , 1 === BTC and 2 === USD
 * @return {string} if value BTC/USD and arg 1 then result is BTC
 */

@Pipe({
  name: 'splitCurrency',
})
export class SplitCurrencyPipe  implements PipeTransform {
  transform(value: string, arg: number): string {
    const pos = arg ? arg - 1 : 0;
    return value.split('/')[pos];
  }
}
