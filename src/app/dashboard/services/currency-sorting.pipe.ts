import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySort',
})
export class CurrencySortingPipe implements PipeTransform {
  transform(array: any[], field: string): any {
    array.sort((a: any, b: any) => {
      const left = +a[field];
      const right = +b[field];
      if (left < right) {
        return 1;
      } else if (left > right) {
        return -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
