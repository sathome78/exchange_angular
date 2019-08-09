import { Pipe, PipeTransform } from '@angular/core';
import * as _reduce from 'lodash/reduce';

@Pipe({
  name: 'buyTotalCalculate',
})
export class BuyTotalCalculatePipe implements PipeTransform {
  transform(array: any[], index: number): number {
    const tempData = array.slice(array.length - (index + 1), array.length);
    return _reduce(
      tempData,
      (sum, n) => {
        return sum + parseFloat(n.amountBase);
      },
      0
    );
  }
}
