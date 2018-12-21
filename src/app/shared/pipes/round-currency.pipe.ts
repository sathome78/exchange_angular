import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'roundCurrency'
})
export class RoundCurrencyPipe implements PipeTransform {
  transform(value: number, isFiat: boolean): string {
    let rounded: number | string;
    if(isFiat) {
      rounded = ((Math.floor(value * 100)) / 100);
    } else {
      rounded = ((Math.floor(value * 100000000)) / 100000000);
    }
    const hasFractionalPart = ('' + rounded).indexOf('.') >= 0;
    if(!hasFractionalPart) {
      rounded = rounded.toFixed(1);
    }
    return '' + rounded;
  }
}
