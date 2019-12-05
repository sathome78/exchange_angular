import { Component, OnDestroy, OnChanges, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, Input } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';
import { Store, select } from '@ngrx/store';

import { State, getMarketCurrencyPairsMap, getIsAuthenticated, getFavoritesCurrencyPair } from 'app/core/reducers/index';
import { CurrencyPair } from '../../../model/currency-pair.model';
import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { MarketService } from '../../services/market.service';
import * as dashboardActions from '../../actions/dashboard.actions';
import { getActiveCurrencyPair } from '../../../core/reducers';

import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointService } from 'app/shared/services/breakpoint.service';
import { DashboardWebSocketService } from 'app/dashboard/dashboard-websocket.service';
import { Subscription } from 'rxjs';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UserService } from '../../../shared/services/user.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { Animations } from 'app/shared/animations';

@Component({
  selector: 'app-markets',
  templateUrl: 'markets.component.html',
  styleUrls: ['markets.component.scss'],
  animations: [Animations.componentTriggerShowOrderBook],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit, OnChanges, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName = 'markets';
  /** active tab pair */
  public currencyDisplayMode = 'BTC';
  public isFiat = false; // must be defined for correct pipe work
  /** Markets data from server */
  public currencyPairs: CurrencyPair[] = [];
  public currencyPairsCache: CurrencyPair[] = [];
  /** Markets data by active tab */
  public pairs: CurrencyPair[] = [];

  @Input() public marketsOffset: number;
  @Input() public clearPreload: boolean;

  private marketsSub$: Subscription;
  public currentCurrencyPair: SimpleCurrencyPair;
  public sortPoint = 'asc';
  public marketSearch = false;
  public searchInput = '';
  public currencyName = 'USD';
  public loading = true;
  public isAuthenticated = false;
  public isMobile = false;
  public isTopMarket = true;
  public userFavorites: number[] = [];

  public tumbHeight = 13;
  public tumbPosition = 0;
  private maxThumbHeight = 13;

  public volumeOrderDirection = 'NONE';
  public selectedCurrencyPair: CurrencyPair;
  public scrollHeight = 0;
  public showContent4 = false;

  @ViewChild('mobileContainer') mobileContainer: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private marketService: MarketService,
    private userService: UserService,
    private store: Store<State>,
    private utilsService: UtilsService,
    public breakpointService: BreakpointService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        this.currentCurrencyPair = pair;
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });

    this.store
      .pipe(select(getFavoritesCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userFavorites: number[]) => {
        this.userFavorites = userFavorites;
        this.filterByMarket(this.currencyDisplayMode, this.searchInput);
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });

    this.store
      .pipe(select(getIsAuthenticated))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.getUserFavoritesCurrencyPairs();
        } else {
          this.store.dispatch(new dashboardActions.SetUserFavoritesCurrencyPairsAction([]));
        }
      });

    this.store
      .pipe(select(getMarketCurrencyPairsMap))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (currencyPairs: MapModel<CurrencyPair>) => {
          this.currencyPairsCache = Object.values(currencyPairs);
          this.filterTopMarket();
          this.filterByMarket(this.currencyDisplayMode, this.searchInput);
          if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
          }
        },
        err => {
          console.error(err);
          if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
          }
        }
      );

    this.subscribeMarkets();
    this.breakpointSub();
  }

  subscribeMarkets(): void {
    this.unsubscribeMarkets();
    this.loadingStarted();
    this.marketsSub$ = this.dashboardWebsocketService
      .marketsSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.store.dispatch(new dashboardActions.SetMarketsCurrencyPairsAction(data));
        this.loadingFinished();
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });
  }

  unsubscribeMarkets() {
    if (this.marketsSub$) {
      this.marketsSub$.unsubscribe();
    }
  }

  calculateCustomScroll(event) {
    const tempHeight = 341 / ((this.pairs.length * 32) / 341);
    this.tumbHeight = tempHeight < this.maxThumbHeight ? this.maxThumbHeight : tempHeight;
    const tempPosition = (341 / this.pairs.length) * event;
    this.tumbPosition = tempPosition;
  }

  breakpointSub() {
    this.breakpointService.breakpoint$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res === 'mobile') {
        this.isMobile = true;
        setTimeout(() => {
          this.scrollHeight = this.mobileContainer.nativeElement.offsetHeight - 144;
          if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
          }
        }, 300);
      } else {
        this.isMobile = false;
        this.scrollHeight = 0;
      }
    });
  }

  getUserFavoritesCurrencyPairs() {
    this.marketService
      .getUserFavoriteCurrencyPairIds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((favoriteIds: number[]) => {
        this.store.dispatch(new dashboardActions.SetUserFavoritesCurrencyPairsAction(favoriteIds));
      });
  }

  ngOnChanges(data) {
    if (data.clearPreload && data.clearPreload.currentValue === false) {
      if (!this.isMobile) {
        setTimeout(() => {
          this.showContent4 = true;
          if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
          }
        }, this.marketsOffset);
      } else {
        this.showContent4 = true;
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      }
    }
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
    this.utilsService.saveActiveCurrencyPairToSS(newActivePair);
    this.userService.getUserBalance(newActivePair);
    if (this.isMobile) {
      this.router.navigate(['/dashboard'], {
        queryParams: { widget: 'trading' },
      });
    }
    this.marketSearch = false;
  }

  /**
   * Filter data on select tab
   * @param {string} value
   */
  selectedTab(value: string): void {
    this.currencyDisplayMode = value;
    this.isFiat = value === 'USD';
    this.currencyName = value;
    this.filterByMarket(value, this.searchInput);
  }

  /**
   * Removes mark as selection for all currency pairs
   * @param no param
   */
  uncheckFavourites() {
    this.pairs.forEach(pair => (pair.isFavorite = false));
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
      return this.currencyPairsCache.filter(
        pair =>
          this.userFavorites.indexOf(pair.currencyPairId) >= 0 &&
            pair.currencyPairName.toUpperCase().startsWith(searchValue.toUpperCase())
      );
    }
    if (market === 'LOC') {
      return this.currencyPairs.filter(
        f =>
          f.market &&
          f.market.toUpperCase() !== 'USD' &&
          f.market.toUpperCase() !== 'BTC' &&
          f.market.toUpperCase() !== 'ETH' &&
          f.market.toUpperCase() !== 'USDT' &&
          f.currencyPairName.toUpperCase().startsWith(searchValue.toUpperCase())
      );
    }
    return this.currencyPairs.filter(
      f =>
        f.market &&
        f.market.toUpperCase() === market.toUpperCase() &&
        f.currencyPairName.toUpperCase().startsWith(searchValue.toUpperCase())
    );
  }

  /** Filter markets data by search-data*/
  searchPair(value: string): void {
    this.searchInput = value;
    this.filterByMarket(this.currencyDisplayMode, value);
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
    if (!this.isAuthenticated) {
      return;
    }
    this.marketService
      .manageUserFavoriteCurrencyPair(pair.currencyPairId, this.getIsFavorite(pair.currencyPairId))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => this.store.dispatch(new dashboardActions.ToggleUserFavoriteCurrencyPair(pair.currencyPairId)),
        error1 => console.error(error1)
      );
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

    while (target.id !== 'markets-container' || target.id !== 'market-search-container' || null) {
      if (target.dataset.favorite) {
        const pair = this.getPairById(+target.dataset.favorite);
        if (pair) {
          this.toggleFavorite(pair);
        }
        target = null;
        return;
      }
      if (target.dataset.marketitem) {
        const pair = this.getPairById(+target.dataset.marketitem);
        if (pair) {
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
    return this.currencyPairsCache.find(item => item.currencyPairId === pairId);
  }

  private loadingFinished(): void {
    this.loading = false;
  }
  private loadingStarted(): void {
    this.loading = true;
  }

  toggleIsTopMarket(val: boolean) {
    this.isTopMarket = val;
    this.filterTopMarket();
    this.filterByMarket(this.currencyDisplayMode, this.searchInput);
  }

  filterTopMarket() {
    this.currencyPairs = this.currencyPairsCache.filter(pair => !!pair.topMarket === this.isTopMarket);
  }

  filterByMarket(market: string, searchInput: string) {
    this.pairs = this.choosePair(market, searchInput);
  }
}
