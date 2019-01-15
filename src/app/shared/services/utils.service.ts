import {Injectable} from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

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

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$').test(control.value.trim());
      return forbidden ? null : {'emailInvalid': {value: control.value.trim()}} ;
    };
  }

}
