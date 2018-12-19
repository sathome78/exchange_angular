import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'roundCurrency'
})
export class RoundCurrencyPipe implements PipeTransform {
  transform(value: number): number {
    return ((Math.floor(value * 100000000)) / 100000000);
  }
}
