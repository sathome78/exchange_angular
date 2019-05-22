import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../services/utils.service';


@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(private utils: UtilsService) {}

  transform(value: number | string, currencyName: string = 'BTC', format: 'full' | 'short' = 'short', setNoneForFiat: boolean = false): string {
    return this.utils.currencyFormat(value, currencyName, format, setNoneForFiat);
  }
}
