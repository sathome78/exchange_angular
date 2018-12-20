import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number | string): string {
    const valueParts: Array<string> = ('' + value).split('.');
    const integer: string = valueParts[0];
    const integerParts: Array<string> = this.getIntegerParts(integer);
    const transformed = [integerParts.join(' '), valueParts[1]].join('.');
    return transformed;
  }


  getIntegerParts(integer: string): Array<string> {
    let i = integer.length % 3;
    const parts = i ? [ integer.substr( 0, i ) ] : [];
    for( ; i < integer.length ; i += 3 ) {
      parts.push(integer.substr( i, 3 ));
    }
    return parts;
  }
}
