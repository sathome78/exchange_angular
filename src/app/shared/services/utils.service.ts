import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {

  private fiatCurrencies: Array<string> = ['USD', 'EUR', 'CNY', 'IDR', 'NGN', 'TRY', 'UAH', 'VND', 'AED'];
  private cache = {}

  isFiat(currencyName: string): boolean {
    if (typeof this.cache[currencyName] !== 'undefined') {
      return this.cache[currencyName]
    }
    const res = this.fiatCurrencies.indexOf(currencyName || '') >= 0;
    this.cache[currencyName] = res;

    return res;
  }

}
