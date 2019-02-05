import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPair } from 'app/model';

@Component({
  selector: 'app-markets-item',
  templateUrl: './markets-item.component.html',
  styleUrls: ['./markets-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketsItemComponent implements OnInit {

  @Input('pair') public pair: CurrencyPair;
  @Input('currentCurrencyPair') public currentCurrencyPair: CurrencyPair;
  @Input('isFiat') public isFiat: boolean;
  @Output('toggleFavorite') public toggleFavorite: EventEmitter<CurrencyPair> = new EventEmitter();
  @Output('onSelectCurrencyPair') public onSelectCurrencyPair: EventEmitter<CurrencyPair> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Split currency pair name
   * @param {CurrencyPair} pair
   * @returns {string[]}
   */
  splitPairName(pair: CurrencyPair): string[] {
    return pair.currencyPairName.split('/');
  }

  isChangePositive(pair: CurrencyPair): boolean {
    return pair.lastOrderRate > pair.predLastOrderRate;
  }

  isFavorite(pair: CurrencyPair): boolean {
    return pair.isFavourite;
  }


}
