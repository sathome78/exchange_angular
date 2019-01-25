import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../services/utils.service';

@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {

  private fraction: number;

  constructor(
    private utils: UtilsService
  ) {}
  transform(value: number | string, format: "full" | "short" = "short", currencyName: string = ''): string {
    console.log(value)
    this.fraction = this.utils.isFiat(currencyName) ? 3 : 8;
    const valueParts: Array<string> = ('' + value).split('.');
    valueParts[1] = !valueParts[1] ? '0' : valueParts[1];
    const integer: string = valueParts[0];
    const integerParts: Array<string> = this.getIntegerParts(integer);

    if (format === 'short') {
      let transformed = valueParts.length > 1
        ? [integerParts.join(' '), valueParts[1]].join('.')
        : [integerParts.join(' '), '0'].join('.');
      transformed = transformed[0] === '.' ? transformed.slice(1) : transformed;
      return transformed;
    }
    if (format === 'full') {
      const transformed = valueParts.length === this.fraction
        ? [integerParts.join(' '), valueParts[1]].join('.')
        : [integerParts.join(' '), this.getValuePart(valueParts[1])].join('.');
      return transformed;
    }

  }
  getValuePart(valuePart: string): string {
    const zeros = this.fraction === 3 ? this.fraction - +valuePart.length - 1 : this.fraction - +valuePart.length;
    let zerosSet = ''
    for (let i = 0; i < zeros; i++) {
      zerosSet += '0'
    }
    return valuePart + zerosSet;
  }


  getIntegerParts(integer: string): Array<string> {
    let i = integer.length % 3;
    const parts = i ? [integer.substr(0, i)] : [];
    for (; i < integer.length; i += 3) {
      parts.push(integer.substr(i, 3));
    }
    return parts;
  }
}
