import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {MockDataService} from '../../services/mock-data.service';
import {MarketService} from './market.service';
import {CurrencyPair} from './currency-pair.model';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import * as _ from 'lodash';
import {CurrencySortingPipe} from './currency-sorting.pipe';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName: string;
  /** active tab pair */
  public currencyDisplayMode = 'BTC';
  /** Markets data from server */
  currencyPairs: CurrencyPair[] = [];
  /** Markets data by active tab */
  pairs: CurrencyPair[] = [];
  public sortPoint = 'asc';


  volumeOrderDirection = 'NONE';
  selectedCurrencyPair: CurrencyPair;

  constructor(
    private marketService: MarketService,
    private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.itemName = 'markets';
    this.volumeOrderDirection = 'NONE';
    this.marketService.setStompSubscription();
    /** for mock data */
    // this.currencyPairs = this.mockData.getMarketsData().map(item => CurrencyPair.fromJSON(item));
    // this.pairs = this.choosePair(this.currencyDisplayMode);
    /** ------------------------ */
    this.marketService.marketListener$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(freshPairs => {
        console.log(freshPairs);
        if (this.currencyPairs.length === 0) {
          this.currencyPairs = freshPairs;
        } else {
          freshPairs.forEach(item => {
            this.addOrUpdate(item);
          });
        }
        this.pairs = this.choosePair(this.currencyDisplayMode);
        this.emitWhenSelectedPairIsUpdated(freshPairs);
        // TODO: remove after dashboard init load time issue is solved
        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.marketService.unsubscribe();
  }

  /**
   * Add or update pair
   * @param {CurrencyPair} newPair
   */
  addOrUpdate(newPair: CurrencyPair) {
    let found = false;
    this.currencyPairs.forEach(elm => {
      if (newPair.currencyPairId === elm.currencyPairId) {
        found = true;
        const chosen = elm.isSelected;
        elm = newPair;
        elm.isSelected = chosen;
      }
    });
    if (!found) {
      this.currencyPairs.push(newPair);
    }
  }


  sortVolume() {
    this.sortPoint === 'asc' ? this.sortPoint = 'desc' : this.sortPoint = 'asc';
    if (this.sortPoint === 'asc') {
      this.pairs = this.pairs.sort((a, b) => a.volume - b.volume);
    } else {
      this.pairs = this.pairs.sort((a, b) => b.volume - a.volume);
    }

    console.log(this.pairs);
  }

  /**
   * Talk about change current pair
   * @param {CurrencyPair} pair
   */
  onSelectCurrencyPair(pair: CurrencyPair): void {
    this.selectedCurrencyPair = pair;
    this.marketService.setActiveCurrency(pair);
  }

  /**
   *  Emit when selected pair is updated
   * @param {CurrencyPair[]} pairs
   */
  emitWhenSelectedPairIsUpdated(pairs: CurrencyPair []): void {
    if (null != this.selectedCurrencyPair) {
      pairs.forEach(elm => {
        if (this.selectedCurrencyPair.currencyPairId === elm.currencyPairId) {
          this.selectedCurrencyPair = CurrencyPair.deepCopy(elm);
          this.onSelectCurrencyPair(this.selectedCurrencyPair);
        }
      });
    }
  }

  /**
   * Filter data on select tab
   * @param {string} value
   */
  selectedTab(value: string): void {
    this.currencyDisplayMode = value;
    this.pairs = this.choosePair(value);
  }

  /**
   * Return array by market
   * @param {string} market
   * @returns {CurrencyPair[]}
   */
  choosePair(market: string): CurrencyPair[] {
    return this.currencyPairs.filter(f => f.market && f.market.toUpperCase() === market.toUpperCase());
  }

  /** Filter markets data by search-data*/
  searchPair(event: string): void {
    this.pairs = this.choosePair(this.currencyDisplayMode).filter(f => f.currencyPairName.toUpperCase().match(event.toUpperCase()));
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
}
