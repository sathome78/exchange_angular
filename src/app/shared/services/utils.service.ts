import {Injectable} from '@angular/core';
import {ValidatorFn, AbstractControl} from '@angular/forms';
// import {CoreService} from 'app/core/services/core.service';

@Injectable()
export class UtilsService {

  // constructor(
  //   private coreService: CoreService
  // ) {
  //   coreService.getSimpleCurrencyPairs()
  //     .subscribe((currs) => {
  //       if(!currs.length) {
  //         return
  //       }
  //       this.fiatCurrencies = currs.map((c) => c.name)
  //     });;
  // }

  private fiatCurrencies: Array<string> = ['USD', 'EUR', 'CNY', 'IDR', 'NGN', 'TRY', 'UAH', 'VND', 'AED', 'RUB'];
  private cache = {}
  private pattern = /(^$|(^([^<>()\[\]\\,;:\s@"]+(\.[^<>()\[\]\\,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  private forbiddenSymbolsEmailRegex = /[~`{}/|?!№#$%^&*":;,[\]<>()=']/ig;
  // private passwordPattern = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9\@\*\%\!\#\^\&\$\<\>\.\'\(\)\-\_\=\+]{8,40})$/ig;
  private passwordPattern = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]|(?=.*[A-Za-z][!@#\$%\^&\*<>\.\(\)\-_=\+\'])[A-Za-z!@#\$%\^&\*<>\.\(\)\-_=\+\'\d]{8,40}/ig;
  private checkCyrilic = /[а-яА-ЯёЁ]/ig;

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
      const forbidden = new RegExp(this.pattern).test(control.value ? control.value.trim() : '');
      const excludeCyrilic = new RegExp(this.checkCyrilic).test(control.value ? control.value.trim() : '')
      return forbidden && !excludeCyrilic ? null : {'emailInvalid': {value: control.value.trim()}} ;
    };
  }

  specialCharacterValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = new RegExp(this.forbiddenSymbolsEmailRegex).test(control.value ? control.value.trim() : '');
      return !forbidden ? null : {'specialCharacter': {value: control.value.trim()}} ;
    };
  }

  passwordCombinationValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value ? control.value.trim() : ''
      const result  = new RegExp(this.passwordPattern).test(value);
      const excludeCyrilic = new RegExp(this.checkCyrilic).test(value)
      return result && !excludeCyrilic ? null : {'passwordValidation': true};
    };
  }

  passwordMatchValidator(firstFieldValue): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const value = control.value ? control.value.trim() : '';
      return value === firstFieldValue.value && value.length === firstFieldValue.value.length ? null : {'passwordsNotMatch': true};
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

