import { Pipe, PipeTransform } from '@angular/core';
import { GAFreeCoinsPrivateResModel } from './models/GAFreeCoins.model';

@Pipe({
  name: 'freecoinStatePipe',
})
export class FreeCoinStatePipe implements PipeTransform {
  public freecoinsStateDefault = new GAFreeCoinsPrivateResModel(1, 1, '2000-01-01 00:00:01', false);

  transform(freecoinsState: GAFreeCoinsPrivateResModel | undefined, key: string) {
    return freecoinsState ? freecoinsState[key] : this.freecoinsStateDefault[key];
  }
}
