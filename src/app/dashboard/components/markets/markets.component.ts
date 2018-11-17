import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Store, select} from '@ngrx/store';

import {getCurrencyPairArray, State} from 'app/core/reducers/index';
import {AuthService} from 'app/services/auth.service';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {MarketService} from './market.service';
import {ChangeCurrencyPairAction} from '../../actions/dashboard.actions';
import {UserService} from '../../../services/user.service';
import {CurrencyPairInfoService} from '../currency-pair-info/currency-pair-info.service';


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
  /** Markets data from server */
  currencyPairs: CurrencyPair[] = [];
  /** Markets data by active tab */
  pairs: CurrencyPair[] = [];
  public sortPoint = 'asc';
  public marketSearch = false;
  public searchInput;


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
    this.pairs = this.choosePair(value);
    this.searchInput = '';
    // console.log(this.pairs);
  }

  /**
   * Return array by market
   * @param {string} market
   * @returns {CurrencyPair[]}
   */
  choosePair(market: string): CurrencyPair[] {
    if (market === 'Favorites') {
      return this.currencyPairs.filter(pair => pair.isFavourite);
    }
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

  toggleFavourite(pair: CurrencyPair) {
    pair.isFavourite = !pair.isFavourite;
    this.marketService.manageUserFavouriteCurrencyPair(pair)
      .subscribe(res => console.log(res), error1 => console.log(error1));
    this.pairs = this.choosePair(this.currencyDisplayMode);
  }

  isFavourite(pair: CurrencyPair): boolean {
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
    this.emitWhenSelectedPairIsUpdated(currencyPairs);
  }
}
