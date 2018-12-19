import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'roundCurrency'
})
export class RoundCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    let rounded: number | string = ((Math.floor(value * 100000000)) / 100000000);
    const hasFractionalPart = ('' + rounded).indexOf('.') >= 0;
    debugger
    if(!hasFractionalPart) {
      rounded = rounded.toFixed(1);
    }
    return '' + rounded;
  }
}
