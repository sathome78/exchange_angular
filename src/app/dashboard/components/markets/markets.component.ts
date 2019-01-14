import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Store, select} from '@ngrx/store';

import {getCurrencyPairArray, State} from 'app/core/reducers/index';
import {AuthService} from 'app/shared/services/auth.service';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {MarketService} from './market.service';
import {ChangeCurrencyPairAction, SetLastSellBuyOrderAction} from '../../actions/dashboard.actions';
import {UserService} from '../../../shared/services/user.service';
import {CurrencyPairInfoService} from '../currency-pair-info/currency-pair-info.service';
import {LastSellBuyOrder} from '../../../model/last-sell-buy-order.model';
import {defaultLastSellBuyOrder} from '../../reducers/default-values';
import {getCurrencyPair} from '../../../core/reducers';


@Component({
  selector: 'app-markets',
  templateUrl: 'markets.component.html',
  styleUrls: ['markets.component.scss']
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName: string;
  /** active tab pair */
  public currencyDisplayMode = 'BTC';
  public isFiat = false;  // must be defined for correct pipe work
  /** Markets data from server */
  currencyPairs: CurrencyPair[] = [];
  /** Markets data from server show preferred pairs*/
  prefPairs: CurrencyPair[] = [];
  /** Markets data by active tab */
  pairs: CurrencyPair[] = [];
  public currentCurrencyPair: CurrencyPair;
  public sortPoint = 'asc';
  public marketSearch = false;
  public searchInput;
  public loading: boolean = true;


  volumeOrderDirection = 'NONE';
  selectedCurrencyPair: CurrencyPair;

  constructor(
    private marketService: MarketService,
    private store: Store<State>,
    private userService: UserService,
    private currencyPairInfoService: CurrencyPairInfoService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'markets';
    this.volumeOrderDirection = 'NONE';
    this.marketService.makeItFast();
    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (currencyPairs: CurrencyPair[]) => {
        this.onGetCurrencyPairs(currencyPairs);
      });

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.currentCurrencyPair = pair;
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

  toggleSearchModal(event) {
    this.marketSearch = !this.marketSearch;
  }

  sortVolume() {
    this.sortPoint === 'asc' ? this.sortPoint = 'desc' : this.sortPoint = 'asc';
    if (this.sortPoint === 'asc') {
      this.pairs = this.pairs.sort((a, b) => a.volume - b.volume);
    } else {
      this.pairs = this.pairs.sort((a, b) => b.volume - a.volume);
    }
  }

  /**
   * Talk about change current pair
   * @param {CurrencyPair} pair
   */
  onSelectCurrencyPair(pair: CurrencyPair): void {
    this.selectedCurrencyPair = pair;
    this.store.dispatch(new ChangeCurrencyPairAction(pair));
    this.currencyPairInfoService.getCurrencyPairInfo(pair);
    this.userService.getUserBalance(pair);
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
    this.isFiat = value === 'USD';
    this.pairs = this.choosePair(value)
      .filter(f => f.currencyPairName.toUpperCase().match(this.searchInput.toUpperCase()));;
    // this.prefPairs = this.choosePrefPairs();
    // this.searchInput = '';
  }

  /**
   * Removes mark as selection for all currency pairs
   * @param no param
   */
  uncheckFavourites() {
    this.pairs.forEach(pair => pair.isFavourite = false);
    this.marketService.removeFavourites();
  }

  /**
   * Return array by market
   * @param {string} market
   * @returns {CurrencyPair[]}
   */
  choosePair(market: string): CurrencyPair[] {
    if (market === 'FAVORITES') {
      return this.currencyPairs.filter(pair => pair.isFavourite);
    }
    return this.currencyPairs.filter(f => f.market && f.market.toUpperCase() === market.toUpperCase());
  }

  // choosePrefPairs() {
  //   const mPairs: CurrencyPair[] = [];
  //   if (this.currencyDisplayMode === 'BTC') {
  //     const luckyBtc: CurrencyPair = this.currencyPairs.find(pair => pair.currencyPairName === 'BTC/USD');
  //     if (luckyBtc) {
  //       mPairs.push(luckyBtc);
  //     }
  //   } else if (this.currencyDisplayMode === 'ETH') {
  //     const luckyEth: CurrencyPair = this.currencyPairs.find(pair => pair.currencyPairName === 'ETH/USD');
  //     if (luckyEth) {
  //       mPairs.push(luckyEth);
  //     }
  //   }
  //   return mPairs;
  // }

  /** Filter markets data by search-data*/
  searchPair(value: string): void {
    this.pairs = this.choosePair(this.currencyDisplayMode)
      .filter(f => f.currencyPairName.toUpperCase().match(value.toUpperCase()));
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

  toggleFavorite(pair: CurrencyPair) {
    pair.isFavourite = !pair.isFavourite;
    this.marketService.manageUserFavouriteCurrencyPair(pair)
      .subscribe(res => console.log(res), error1 => console.log(error1));
    this.pairs = this.choosePair(this.currencyDisplayMode);
  }

  isFavorite(pair: CurrencyPair): boolean {
    return pair.isFavourite;
  }

  private onGetCurrencyPairs(currencyPairs: CurrencyPair[]) {
    if (this.currencyPairs.length === 0) {
      this.currencyPairs = currencyPairs;
    } else {
      currencyPairs.forEach(item => {
        this.addOrUpdate(item);
      });
    }
    this.pairs = this.choosePair(this.currencyDisplayMode);
    // this.prefPairs = this.choosePrefPairs();
    this.emitWhenSelectedPairIsUpdated(currencyPairs);
    this.loadingFinished();
  }


  private loadingFinished() {
    if(this.pairs && this.pairs.length && this.loading) {
      // debugger
      this.loading = false;
    }
  }
}
