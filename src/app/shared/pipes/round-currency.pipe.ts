import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'roundCurrency'
})
export class RoundCurrencyPipe implements PipeTransform {

  transform(value: number, isFiat: boolean): string {
    let rounded: number | string;
    if (isFiat) {
      rounded = ((Math.floor(value * 100)) / 100);
    } else {
      rounded = ((Math.floor(value * 100000000)) / 100000000);
    }
    rounded = rounded.toFixed(8).replace(/\.?0+$/, '');
    return '' + rounded;
  }

  // transform(value: number, isFiat: boolean): string {
  //   let rounded: number | string;
  //   if (isFiat) {
  //     rounded = ((Math.floor(value * 100)) / 100);
  //   } else {
  //     rounded = ((Math.floor(value * 100000000)) / 100000000);
  //   }
  //   const numParts = ('' + rounded).split('.');
  //   if (numParts.length === 1) {
  //     rounded = rounded.toFixed(1);
  //   } else {
  //     const fractPartLength = numParts[1].length;
  //     rounded = rounded.toFixed(fractPartLength);
  //   }
  //   return '' + rounded;
  // }

}
