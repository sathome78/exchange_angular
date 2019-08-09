import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import prettyNum from 'pretty-num';
// import {CoreService} from 'app/core/services/core.service';

@Injectable()
export class UtilsService {
  private fiatCurrencies: string[] = ['USD', 'EUR', 'CNY', 'IDR', 'NGN', 'TRY', 'UAH', 'VND', 'AED', 'RUB'];
  private cache = {};
  // tslint:disable-next-line: max-line-length
  private pattern = /(^$|(^([^<>()\[\]\\,;:\s@"]+(\.[^<>()\[\]\\,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  private forbiddenSymbolsEmailRegex = /[~`{}/|?!№#$%^&*":;,[\]<>()=']/gi;
  // tslint:disable-next-line: max-line-length
  private passwordPattern = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]|(?=.*[A-Za-z][!@#\$%\^&\*<>\.\(\)\-_=\+\'])[A-Za-z!@#\$%\^&\*<>\.\(\)\-_=\+\'\d]{8,40}/gi;
  private checkCyrilic = /[а-яА-ЯёЁ]/gi;
  private fraction: number;

  isFiat(currencyName: string): boolean {
    if (currencyName === 'BTC') {
      return false;
    }
    if (typeof this.cache[currencyName] !== 'undefined') {
      return this.cache[currencyName];
    }
    const res = this.fiatCurrencies.indexOf(currencyName || '') >= 0;
    this.cache[currencyName] = res;

    return res;
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = new RegExp(this.pattern).test(control.value ? control.value.trim() : '');
      const excludeCyrilic = new RegExp(this.checkCyrilic).test(control.value ? control.value.trim() : '');
      return forbidden && !excludeCyrilic ? null : { emailInvalid: { value: control.value.trim() } };
    };
  }

  specialCharacterValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = new RegExp(this.forbiddenSymbolsEmailRegex).test(control.value ? control.value.trim() : '');
      return !forbidden ? null : { specialCharacter: { value: control.value.trim() } };
    };
  }

  passwordCombinationValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value ? control.value.trim() : '';
      const result = new RegExp(this.passwordPattern).test(value);
      const excludeCyrilic = new RegExp(this.checkCyrilic).test(value);
      return result && !excludeCyrilic ? null : { passwordValidation: true };
    };
  }

  passwordMatchValidator(firstFieldValue): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value ? control.value.trim() : '';
      return value === firstFieldValue.value && value.length === firstFieldValue.value.length
        ? null
        : { passwordsNotMatch: true };
    };
  }

  deleteSpace(value): string {
    if (!!value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }

  saveActiveCurrencyPairToSS(pair: SimpleCurrencyPair): void {
    sessionStorage.setItem('activePair', JSON.stringify(pair));
  }
  getActiveCurrencyPairFromSS(): string {
    return sessionStorage.getItem('activePair');
  }

  encodePassword(password, key) {
    const pass = this.strToByteArray(password);
    const keys = this.strToByteArray(key);
    const encoded = [pass.length];
    for (let z = 0; z < pass.length; z += 1) {
      encoded[z] = this.implementXor(pass[z], keys[z % keys.length]);
    }
    return btoa(String.fromCharCode.apply(null, encoded));
  }

  private strToByteArray(str) {
    const arr = [];
    for (let i = 0; i < str.length; i += 1) {
      arr.push(str.charCodeAt(i));
    }
    return arr;
  }

  private implementXor(left, right) {
    let one = left.toString(2);
    let two = right.toString(2);
    let result = '';
    if (one.length > two.length) {
      while (one.length > two.length) {
        two = '0' + two;
      }
      for (let x = 0; x < one.length; x += 1) {
        if (one[x] === two[x]) {
          result += '0';
        } else {
          result += '1';
        }
      }
    } else {
      while (two.length > one.length) {
        one = '0' + one;
      }
      for (let y = 0; y < one.length; y += 1) {
        if (one[y] === two[y]) {
          result += '0';
        } else {
          result += '1';
        }
      }
    }
    return parseInt(result, 2);
  }

  // this method is used in pipe (currencyFormat)
  currencyFormat(
    value: number | string,
    currencyName: string = 'BTC',
    format: 'full' | 'short' = 'short',
    setNoneForFiat: boolean = false
  ): string {
    if (!value || Number.isNaN(parseFloat(typeof value === 'string' ? value : value.toString()))) {
      return '0.0';
    }

    if (setNoneForFiat) {
      this.fraction = this.isFiat(currencyName) ? 0 : 8;
    } else {
      this.fraction = !currencyName || currencyName === 'NONE' ? 0 : this.isFiat(currencyName) ? 2 : 8;
    }

    if (this.fraction === 0) {
      const exponentFree = prettyNum(value);
      const valueParts: string[] = exponentFree.split('.');
      const valuePart = this.makeValueFiatPart(valueParts[1] || '');
      const integerPart = prettyNum(valueParts[0], { thousandsSeparator: ' ' });
      return `${integerPart}.${valuePart}`;
    }
    return format === 'full'
      ? prettyNum(value, {
        thousandsSeparator: ' ',
        precision: this.fraction,
        rounding: 'fixed',
      })
      : this.addFractionIfNeed(
          prettyNum(value, {
            thousandsSeparator: ' ',
            precision: this.fraction,
          })
        );
  }

  private addFractionIfNeed(value: string) {
    return value.indexOf('.') === -1 ? `${value}.0` : value;
  }

  private makeValueFiatPart(value: string) {
    if (!value) {
      return '00';
    }
    return value.length < 2 ? value + '0' : value.slice(0, 8);
  }

  currencyNumberFromStringFormat(value: string): number {
    const candidate = parseFloat(this.deleteSpace(value));
    return !!candidate ? candidate : 0;
  }

  isDeveloper(userInfo: ParsedToken): boolean {
    return userInfo && userInfo.username && userInfo.username.indexOf('@upholding.biz') !== -1;
  }

  get isDisabledCaptcha(): boolean {
    return localStorage.getItem('captcha') === 'false';
  }

  checkIsDeveloper(name: string = '') {
    return name.indexOf('@upholding.biz') !== -1;
  }

  get isProdHost() {
    return window.location.hostname === 'exrates.me';
  }

  isDevCaptcha(name: string = '') {
    // UNCOMMENT WHEN NEED USER UPHOLDING CHECK
    // return this.checkIsDeveloper(name) && this.isDisabledCaptcha && !this.isProdHost;
    return this.isDisabledCaptcha && !this.isProdHost;
  }
}
