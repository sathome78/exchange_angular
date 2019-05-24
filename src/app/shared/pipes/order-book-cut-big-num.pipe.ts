import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBookCutBigNum',
})
export class OrderBookCutBigNumPipe  implements PipeTransform {

  transform(value: string, countChar = 17): string {
    if (value.length > countChar) {
      const maxString = value.substr(0, countChar);
      const lastCharacter = maxString[maxString.length - 1];
      return `${maxString.substr(0, countChar - 1)}${!Number.isInteger(+lastCharacter) ? '' : +lastCharacter !== 9 ? +lastCharacter + 1 : lastCharacter}`;
    }
    return value;
  }
}
