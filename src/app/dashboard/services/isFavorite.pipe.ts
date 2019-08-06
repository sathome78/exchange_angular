import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPair } from 'app/model';

@Pipe({ name: 'isFavoritePipe' })
export class IsFavoritePipe implements PipeTransform {
  transform(pair: CurrencyPair, userFavorites: Array<number> = []): any {
    return userFavorites.indexOf(pair.currencyPairId) >= 0;
  }
}
