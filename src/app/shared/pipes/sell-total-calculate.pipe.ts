import { Pipe, PipeTransform } from '@angular/core';
import * as _reduce from 'lodash/reduce';

@Pipe({
  name: 'sellTotalCalculate'
})
export class SellTotalCalculatePipe  implements PipeTransform {
  transform(array: any[], index: number): number {

    const tempData = array.slice(index)
    return _reduce(tempData, (sum, n) => {
      return sum + parseFloat(n.amountBase);
    }, 0);
  }
}
