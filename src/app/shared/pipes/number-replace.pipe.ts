import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'replaceNumber'
})
export class ReplaceNumberPipe implements PipeTransform {
  transform(value: number | string, isFiat?: boolean): string {
    if (isFiat !== undefined) {
      const toFixedNumbers = isFiat ? 2 : 8;
      value = Number(value).toFixed(toFixedNumbers);
    }
    if (value) {
      const replaceMask = ' ';
      const searchMask = ',';
      const regex = new RegExp(searchMask, 'ig');

      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }
}
