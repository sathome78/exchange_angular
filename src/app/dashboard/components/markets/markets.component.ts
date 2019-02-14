import {Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Store, select} from '@ngrx/store';

import {getCurrencyPairArray, State} from 'app/core/reducers/index';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {MarketService} from './market.service';
import * as dashboardActions from '../../actions/dashboard.actions';
import {UserService} from '../../../shared/services/user.service';
import {getCurrencyPair} from '../../../core/reducers';
import {DashboardWebSocketService} from 'app/dashboard/dashboard-websocket.service';
import { AuthService } from 'app/shared/services/auth.service';


@Component({
  selector: 'app-markets',
  templateUrl: 'markets.component.html',
  styleUrls: ['markets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  public searchInput = '';
  public currencyName = 'USD';
  public loading: boolean = true;


  volumeOrderDirection = 'NONE';
  selectedCurrencyPair: CurrencyPair;

  constructor(
    private marketService: MarketService,
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private authService: AuthService,
    private crd: ChangeDetectorRef,
    private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'markets';
    this.volumeOrderDirection = 'NONE';
    this.marketService.makeItFast(this.ngUnsubscribe);
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

    this.dashboardWebsocketService.setRabbitStompSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.marketService.makeItFast(this.ngUnsubscribe);
      })
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
    this.sortPoint = this.sortPoint === 'asc' ? 'desc' :  'asc';
    if (this.sortPoint === 'asc') {
      this.pairs = this.pairs.sort((a, b) => a.currencyVolume - b.currencyVolume);
    } else {
      this.pairs = this.pairs.sort((a, b) => b.currencyVolume - a.currencyVolume);
    }
  }

  /**
   * Talk about change current pair
   * @param {CurrencyPair} pair
   */
  onSelectCurrencyPair(pair: CurrencyPair): void {
    this.selectedCurrencyPair = pair;
    this.store.dispatch(new dashboardActions.ChangeCurrencyPairAction(pair));
    this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(pair.currencyPairId))
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
    this.currencyName = value;
    this.pairs = !this.searchInput ?
      this.choosePair(value) :
      this.choosePair(value).filter(f => f.currencyPairName.toUpperCase().match(this.searchInput.toUpperCase()));
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
    if (market === 'LOC') {
      return this.currencyPairs.filter(f => f.market
        && f.market.toUpperCase() !== 'USD'
        && f.market.toUpperCase() !== 'BTC'
        && f.market.toUpperCase() !== 'ETH');
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
    if(!this.authService.isAuthenticated()) {
      return;
    }
    pair.isFavourite = !pair.isFavourite;
    this.marketService.manageUserFavouriteCurrencyPair(pair)
      .pipe(takeUntil(this.ngUnsubscribe))
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
    this.crd.detectChanges();
  }


  private loadingFinished() {
    if(this.pairs && this.pairs.length && this.loading) {
      this.loading = false;
    }
  }

  trackByFn(index, item) {
    return item.currencyPairId; // or item.id
  }

  onClickMarketItem(e) {
    if (e.target === e.currentTarget) {
      return;
    }

    let target = e.target;

    while(target.id !== 'markets-container' || null) {
      if(target.dataset.favorite) {
        const pair = this.getPairById(+target.dataset.favorite)
        if(pair) {
          this.toggleFavorite(pair);
        }
        target = null;
        return;
      }
      if(target.dataset.marketitem) {
        const pair = this.getPairById(+target.dataset.marketitem)
        if(pair) {
          this.onSelectCurrencyPair(pair);
        }
        target = null;
        return;
      }
      target = target.parentElement;
    }
  }

  getPairById(pairId: number): CurrencyPair {
    return this.pairs.find((item) => item.currencyPairId === pairId);
  }
}
