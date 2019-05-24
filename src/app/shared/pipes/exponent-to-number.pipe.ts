import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  name: 'exponentToNumber',
})
export class ExponentToNumberPipe  implements PipeTransform {

  constructor(
    private utils: UtilsService,
  ) {}

  transform(x): string {
    x = this.utils.deleteSpace(x);
    const str = x.toString();
    if (str.indexOf('e') !== -1) {
      const exponent = parseInt(str.split('-')[1], 10);
      const result = parseFloat(x).toFixed(exponent);
      return exponent > 8 ? '0' : result;
    }
    return x;

  }
}
