import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPair } from 'app/model';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';

@Component({
  selector: 'app-markets-item',
  templateUrl: './markets-item.component.html',
  styleUrls: ['./markets-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsItemComponent implements OnInit {
  @Input() public pair: CurrencyPair;
  @Input() public isFavorite: boolean;
  @Input() public currentCurrencyPair: SimpleCurrencyPair;
  @Input() public isFiat: boolean;
  @Input() public isAuthenticated: boolean;

  constructor() {}

  ngOnInit() {}

  splitPairName(pair: CurrencyPair): string[] {
    return pair.currencyPairName.split('/');
  }

  isChangePositive(pair: CurrencyPair): boolean {
    return +pair.lastOrderRate >= +pair.lastOrderRate24hr;
  }

  isChangePositiveRow(pair: CurrencyPair): boolean {
    return +pair.lastOrderRate >= +pair.predLastOrderRate;
  }
}
