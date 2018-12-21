import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {CurrencyPair} from '../../../model/currency-pair.model';
import {MarketService} from '../markets/market.service';

@Component({
  selector: 'app-market-search',
  templateUrl: 'market-search.component.html',
  styleUrls: ['market-search.component.scss']
})
export class MarketSearchComponent implements OnInit {

  @Input() pairs: CurrencyPair[];
  @Input() isFiat: boolean;
  public showPairs: CurrencyPair[];

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private marketService: MarketService,
  ) { }

  ngOnInit() {
    this.showPairs = [...this.pairs || []];
  }

  splitPairName(name: string): string[] {
    return name.split('/');
  }

  onSearch(event) {
    this.showPairs = this.pairs.filter(f => f.currencyPairName.toUpperCase().match(event.toUpperCase()));
  }

  onCloseModal() {
    this.closeModal.emit(true);
  }

  setCurrentPair(pair: CurrencyPair) {
    this.marketService.activeCurrencyListener.next(pair);
    this.onCloseModal();
  }

  isFavorite(pair: CurrencyPair): boolean {
    return pair.isFavourite;
  }
}
