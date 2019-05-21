import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../services/utils.service';


@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(private utils: UtilsService) {}

  transform(value: number | string, format: 'full' | 'short' = 'short', currencyName: string = 'BTC', setCurrencyNameNONE: boolean = false): string {
    return this.utils.currencyFormat(value, format, currencyName, setCurrencyNameNONE);
  }
}
