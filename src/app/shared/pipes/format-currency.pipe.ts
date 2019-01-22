import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number | string, format: "full" | "short" = "short"): string {
    const valueParts: Array<string> = ('' + value).split('.');
    valueParts[1] = !valueParts[1] ? '0' : valueParts[1];
    const integer: string = valueParts[0];
    const integerParts: Array<string> = this.getIntegerParts(integer);

    if (format === 'short') {
      const transformed = valueParts.length > 1
        ? [integerParts.join(' '), valueParts[1]].join('.')
        : [integerParts.join(' '), '0'].join('.');
      return transformed;
    }
    if (format === 'full') {
      const transformed = valueParts.length === 8
        ? [integerParts.join(' '), valueParts[1]].join('.')
        : [integerParts.join(' '), this.getValuePart(valueParts[1])].join('.');
      return transformed;
    }

  }
  getValuePart(valuePart: string): string {
    const zeros = 8 - +valuePart.length;
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
