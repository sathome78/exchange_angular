import {Injectable} from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable()
export class UtilsService {

  private fiatCurrencies: Array<string> = ['USD', 'EUR', 'CNY', 'IDR', 'NGN', 'TRY', 'UAH', 'VND', 'AED'];
  private cache = {}
  private pattern = /(^$|(^([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  private forbiddenSymbolsEmailRegex = /[!№#$%^&*<>()=']/ig;
  private allowedSymbolsPasswordRegex = /[\@\*\%\!\#\^\&\$\<\>\.\(\)\-\_\=\+]/ig;

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
      const forbidden = new RegExp(this.pattern).test(control.value.trim());
      return forbidden ? null : {'emailInvalid': {value: control.value.trim()}} ;
    };
  }

  specialCharacterValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = new RegExp(this.forbiddenSymbolsEmailRegex).test(control.value.trim());
      return !forbidden ? null : {'specialCharacter': {value: control.value.trim()}} ;
    };
  }

  passwordCombinationValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value ? control.value.trim() : ''
      const hasSpecialChar = new RegExp(this.allowedSymbolsPasswordRegex).test(value);
      const hasNumber = new RegExp(/[0-9]/ig).test(value);
      const hasChar = new RegExp(/[A-Za-z]/ig).test(value);
      return (hasChar && hasNumber) || (hasChar && hasSpecialChar) ? null : {'passwordValidation': true};
    };
  }

  passwordMatchValidator(firstFieldValue): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value ? control.value.trim() : '';
      return value === firstFieldValue.value && value.length === firstFieldValue.value.length ? null : {'passwordsNotMatch': true}
    };
  }

  deleteSpace(value): string {
    if (value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }

}
