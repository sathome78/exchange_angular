import {Component, OnDestroy, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {MarketService} from './market.service';
import {CurrencyPair} from './currency-pair.model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  currencyPairs: CurrencyPair[] = [];
  pairs: CurrencyPair[] = [];
  marketSubscription: any;
  currencyDisplayMode = 'BTC';
  volumeOrderDirection = 'NONE';
  selectedCurrencyPair: CurrencyPair;
  showSelectedOnly = false;

  constructor(private marketService: MarketService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'markets';
    this.volumeOrderDirection = 'NONE';
    this.marketService.setStompSubscription();
    this.marketSubscription = this.marketService.marketListener
      .subscribe(freshPairs => {
        if (this.currencyPairs.length === 0) {
          this.currencyPairs = freshPairs;
        } else {
          freshPairs.forEach(item => {
            this.addOrUpdate(item);
          });
        }
        this.getCurrencyPairsForMarket(this.currencyDisplayMode);
        this.emitWhenSelectedPairIsUpdated(freshPairs);
      });
  }

  ngOnDestroy(): void {
    this.marketSubscription.unsubscribe();
    this.marketService.unsubscribe();
  }

  addOrUpdate(newPair: CurrencyPair) {
    let found = false;
    this.currencyPairs.forEach(elm => {
      if (newPair.pairId === elm.pairId) {
        found = true;
        const chosen = elm.isSelected;
        elm = newPair;
        elm.isSelected = chosen;
      }
    });
    if (! found) {
      this.currencyPairs.push(newPair);
    }
  }

  getPairs() {
    if (this.volumeOrderDirection === 'NONE') {
      return this.pairs;
    } else {
      return this.pairs.sort(this.volumeSort.bind(this));
    }
  }

  onShowSelected() {
    this.removeSort();
    this.showSelectedOnly = !this.showSelectedOnly;
    if (this.showSelectedOnly) {
      const temp: CurrencyPair[] = [];
      this.pairs.forEach((item) => {
        if (item.isSelected === this.showSelectedOnly) {
          temp.push(item);
        }
      });
      this.pairs = temp;
    } else {
      this.getCurrencyPairsForMarket(this.currencyDisplayMode);
    }
  }

  changeCurrencyTo(value: string) {
    this.removeSort();
    // this.searchInput.nativeElement.value = '';
    this.currencyDisplayMode = value;
    this.getCurrencyPairsForMarket(value);
  }

  getCurrencyPairsForMarket(market: string) {
    this.removeSort();
    this.pairs = [];
    this.currencyPairs.forEach(elm => {
      if (elm.market.toUpperCase() === market.toUpperCase()) {
        const item = CurrencyPair.deepCopy(elm);
        if (market.toUpperCase() !== 'FIAT') {
          item.currencyPairName = item.currencyPairName.replace(market.toUpperCase(), '');
          item.currencyPairName = item.currencyPairName.replace('/', '');
        }
        this.pairs.push(item);
      }
    });
  }

  onSelectItem(pair: CurrencyPair) {
    this.removeSort();
    const pairsIndex = this.pairs.indexOf(pair);
    if (pairsIndex > -1) {
      this.pairs[pairsIndex].isSelected = !this.pairs[pairsIndex].isSelected;
    }
    this.currencyPairs.forEach(elm => {
      if (elm.pairId === pair.pairId) {
        elm.isSelected = !elm.isSelected;
      }
    });
  }

  clearSelected() {
    this.removeSort();
    this.pairs.forEach(item => {
      item.isSelected = false;
    });
    this.currencyPairs.forEach(elm => {
      elm.isSelected = false;
    });
  }

  onSearch(value: string) {
    this.removeSort();
    if (value.length > 1) {
      this.pairs = [];
      this.currencyPairs.forEach(item => {
        if ( item.currencyPairName.includes(value.toUpperCase())) {
          this.pairs.push(item);
        }
      });
    } else {
      this.getCurrencyPairsForMarket(this.currencyDisplayMode);
    }
  }

  volumeSort(left: CurrencyPair, right: CurrencyPair) {
    if (this.volumeOrderDirection === 'ASC') {
      return left.volume > right.volume ? 1 : -1;
    } else {
      return left.volume > right.volume ? -1 : 1;
    }
  }

  sort() {
    if (this.volumeOrderDirection === 'NONE') {
      this.volumeOrderDirection = 'ASC';
    } else {
      this.volumeOrderDirection = this.volumeOrderDirection === 'ASC' ? 'DESC' : 'ASC';
    }
  }

  removeSort() {
    this.volumeOrderDirection = 'NONE';
  }

  onSelectCurrencyPair(pair: CurrencyPair) {
    this.selectedCurrencyPair = pair;
    this.marketService.setActiveCurrency(pair);
  }

  emitWhenSelectedPairIsUpdated(pairs: CurrencyPair []) {
    if (null != this.selectedCurrencyPair) {
      pairs.forEach(elm => {
        if (this.selectedCurrencyPair.pairId === elm.pairId) {
          this.selectedCurrencyPair = CurrencyPair.deepCopy(elm);
          this.onSelectCurrencyPair(this.selectedCurrencyPair);
        }
      });
    }
  }

  isPairSelected(pair: CurrencyPair) {
    return this.selectedCurrencyPair && pair.pairId === this.selectedCurrencyPair.pairId;
  }

}
