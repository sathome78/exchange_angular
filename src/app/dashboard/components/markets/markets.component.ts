import {Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs/Subject';
import {Store, select} from '@ngrx/store';

import {State, getMarketCurrencyPairsMap, getIsAuthenticated, getFavoritesCurrencyPair} from 'app/core/reducers/index';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {MarketService} from './market.service';
import * as dashboardActions from '../../actions/dashboard.actions';
import {UserService} from '../../../shared/services/user.service';
import {getActiveCurrencyPair} from '../../../core/reducers';
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
  public itemName: string = 'markets';
  /** active tab pair */
  public currencyDisplayMode = 'BTC';
  public isFiat = false;  // must be defined for correct pipe work
  /** Markets data from server */
  public currencyPairs: CurrencyPair[] = [];
  /** Markets data by active tab */
  public pairs: CurrencyPair[] = [];

  public currentCurrencyPair: CurrencyPair;
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
    private marketService: MarketService,
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private authService: AuthService,
    private crd: ChangeDetectorRef,
    private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.getMarketsCurrencyPairs();

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.currentCurrencyPair = pair;
        this.crd.detectChanges();
      });

    this.store
      .pipe(select(getFavoritesCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userFavorites: number[]) => {
        this.userFavorites = userFavorites;
        this.pairs = this.choosePair(this.currencyDisplayMode);
        this.crd.detectChanges();
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
        this.loadingFinished();
        this.crd.detectChanges();
      });

    this.dashboardWebsocketService.setRabbitStompSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.getMarketsCurrencyPairs();
      })
  }

  getMarketsCurrencyPairs(): void {
    this.marketService.getCurrencyPairForMarketFast()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currencyPairs: CurrencyPair[]) => {
        this.store.dispatch(new dashboardActions.SetMarketsCurrencyPairsAction(currencyPairs))
      })
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
    this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(pair));
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
        res => this.store.dispatch(new dashboardActions.ToggleUserFavoriteCurrencyPair(pair.currencyPairId) ),
        error1 => console.log(error1));
  }

  isFavorite(pair: CurrencyPair): boolean {
    return pair.isFavorite;
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

  getIsFavorite(currencyPairId) {
    return this.userFavorites.indexOf(currencyPairId) >= 0;
  }

  getPairById(pairId: number): CurrencyPair {
    return this.pairs.find((item) => item.currencyPairId === pairId);
  }
}
