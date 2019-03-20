import {Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Store, select} from '@ngrx/store';

import {State, getMarketCurrencyPairsMap, getIsAuthenticated, getFavoritesCurrencyPair} from 'app/core/reducers/index';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {MarketService} from './market.service';
import * as dashboardActions from '../../actions/dashboard.actions';
import {getActiveCurrencyPair} from '../../../core/reducers';

import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointService} from 'app/shared/services/breakpoint.service';
import {DashboardWebSocketService} from 'app/dashboard/dashboard-websocket.service';
import {Subscription} from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import {UserService} from '../../../shared/services/user.service';


@Component({
  selector: 'app-markets',
  templateUrl: 'markets.component.html',
  styleUrls: ['markets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName: string = 'markets';
  /** active tab pair */
  public currencyDisplayMode = 'BTC';
  public isFiat = false;  // must be defined for correct pipe work
  /** Markets data from server */
  public currencyPairs: CurrencyPair[] = [];
  /** Markets data by active tab */
  public pairs: CurrencyPair[] = [];

  private marketsSub$: Subscription;
  public currentCurrencyPair: SimpleCurrencyPair;
  public sortPoint = 'asc';
  public marketSearch = false;
  public searchInput = '';
  public currencyName = 'USD';
  public loading: boolean = true;
  public isAuthenticated: boolean = false;
  public userFavorites: number[] = [];

  public volumeOrderDirection = 'NONE';
  public selectedCurrencyPair: CurrencyPair;

  constructor(
    private cdr: ChangeDetectorRef,
    private marketService: MarketService,
    private userService: UserService,
    private store: Store<State>,
    public breakpointService: BreakpointService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.currentCurrencyPair = pair;
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getFavoritesCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userFavorites: number[]) => {
        this.userFavorites = userFavorites;
        this.pairs = this.choosePair(this.currencyDisplayMode, this.searchInput);
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if(isAuthenticated) {
          this.getUserFavoritesCurrencyPairs();
        } else {
          this.store.dispatch(new dashboardActions.SetUserFavoritesCurrencyPairsAction([]))
        }
      });

    this.store
      .pipe(select(getMarketCurrencyPairsMap))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currencyPairs: MapModel<CurrencyPair>) => {
        this.currencyPairs = Object.values(currencyPairs);
        this.pairs = this.choosePair(this.currencyDisplayMode);
        this.cdr.detectChanges();
      }, (err) => {
        console.error(err);
        this.cdr.detectChanges();
      });

    this.subscribeOrderBook();
  }

  subscribeOrderBook(): void {
    this.unsubscribeOrderBook();
    this.loadingStarted();
    this.marketsSub$ = this.dashboardWebsocketService.marketsSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        const parsedData = JSON.parse(data[0]);
        // console.log('markets', parsedData);
        this.store.dispatch(new dashboardActions.SetMarketsCurrencyPairsAction(parsedData.data))
        this.loadingFinished();
        this.cdr.detectChanges();
      })
  }

  unsubscribeOrderBook() {
    if(this.marketsSub$) {
      this.marketsSub$.unsubscribe();
    }
  }

  getUserFavoritesCurrencyPairs() {
    this.marketService.getUserFavoriteCurrencyPairIds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((favoriteIds: number[]) => {
        this.store.dispatch(new dashboardActions.SetUserFavoritesCurrencyPairsAction(favoriteIds))
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleSearchModal(event) {
    this.marketSearch = !this.marketSearch;
  }

  sortVolume() {
    this.sortPoint = this.sortPoint === 'asc' ? 'desc' : 'asc';
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
    const newActivePair = new SimpleCurrencyPair(pair.currencyPairId, pair.currencyPairName);
    this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(newActivePair));
    const simplePair = {
      id: pair.currencyPairId,
      name: pair.currencyPairName
    };
    this.userService.getUserBalance(simplePair);
    if (this.route.snapshot.paramMap.get('currency-pair')) {
       this.router.navigate(['/']);
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
    this.pairs = this.choosePair(value, this.searchInput);
  }

  /**
   * Removes mark as selection for all currency pairs
   * @param no param
   */
  uncheckFavourites() {
    this.pairs.forEach(pair => pair.isFavorite = false);
    this.marketService.removeFavorites();
  }

  /**
   * Return array by market
   * @param {string} market
   * @param {string} searchValue
   * @returns {CurrencyPair[]}
   */
  choosePair(market: string, searchValue: string = ''): CurrencyPair[] {
    if (market === 'FAVORITES') {
      return this.currencyPairs
        .filter(pair => this.userFavorites.indexOf(pair.currencyPairId) >= 0
          && pair.currencyPairName.toUpperCase().startsWith(searchValue.toUpperCase()));
    }
    if (market === 'LOC') {
      return this.currencyPairs
        .filter(f => f.market
          && f.market.toUpperCase() !== 'USD'
          && f.market.toUpperCase() !== 'BTC'
          && f.market.toUpperCase() !== 'ETH'
          && f.currencyPairName.toUpperCase().startsWith(searchValue.toUpperCase()));
    }
    return this.currencyPairs
      .filter(f => f.market
        && f.market.toUpperCase() === market.toUpperCase()
        && f.currencyPairName.toUpperCase().startsWith(searchValue.toUpperCase()));
  }


  /** Filter markets data by search-data*/
  searchPair(value: string): void {
    this.pairs = this.choosePair(this.currencyDisplayMode, value)
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
    if(!this.isAuthenticated) {
      return;
    }
    this.marketService.manageUserFavoriteCurrencyPair(pair.currencyPairId, this.getIsFavorite(pair.currencyPairId))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => this.store.dispatch(new dashboardActions.ToggleUserFavoriteCurrencyPair(pair.currencyPairId)),
        error1 => console.error(error1));
  }

  isFavorite(pair: CurrencyPair): boolean {
    return pair.isFavorite;
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

  getIsFavorite(currencyPairId) {
    return this.userFavorites.indexOf(currencyPairId) >= 0;
  }

  getPairById(pairId: number): CurrencyPair {
    return this.pairs.find((item) => item.currencyPairId === pairId);
  }

  private loadingFinished(): void {
    this.loading = false;
  }
  private loadingStarted(): void {
    this.loading = true;
  }

}
