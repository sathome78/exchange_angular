import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MarketService } from 'app/dashboard/services/market.service';
import { UserService } from 'app/shared/services/user.service';
import { State, getMarketCurrencyPairsMap, getIsAuthenticated, getFavoritesCurrencyPair } from 'app/core/reducers/index';
import { UtilsService } from 'app/shared/services/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CurrencyPair } from 'app/model';
import * as dashboardActions from 'app/dashboard/actions/dashboard.actions';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { BreakpointService } from 'app/shared/services/breakpoint.service';

@Component({
  selector: 'app-markets-home',
  templateUrl: './markets-home.component.html',
  styleUrls: ['./markets-home.component.scss'],
})
export class MarketsHomeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public userFavorites: number[] = [];
  public isAuthenticated = false;
  public currencyPairsCache: CurrencyPair[] = [];
  public currencyPairsTop: CurrencyPair[] = [];
  public formatedPairs: CurrencyPair[] = [];
  public loading = true;
  public currencyDisplayMode = 'ALL';
  public searchInput = '';
  // public sortPoint = 'asc';
  public marketSearch = false;
  // public currencyName = 'USD';
  public isMobile = false;
  // public isTopMarket = true;

  constructor(
    private marketService: MarketService,
    private userService: UserService,
    private store: Store<State>,
    private utilsService: UtilsService,
    public breakpointService: BreakpointService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.store
      .pipe(select(getFavoritesCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userFavorites: number[]) => {
        this.userFavorites = userFavorites;
        this.filterByMarket(this.currencyDisplayMode, this.searchInput);
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
          this.currencyPairsCache = Object.values(currencyPairs).sort((a, b) => +b.currencyVolume - +a.currencyVolume);
          this.filterTopMarket();
          this.filterByMarket(this.currencyDisplayMode, this.searchInput);
          // console.log(currencyPairs);
        },
        err => {
          console.error(err);
        }
      );

    this.breakpointSub();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getUserFavoritesCurrencyPairs() {
    this.marketService
      .getUserFavoriteCurrencyPairIds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((favoriteIds: number[]) => {
        this.store.dispatch(new dashboardActions.SetUserFavoritesCurrencyPairsAction(favoriteIds));
      });
  }

  selectedTab(value: string): void {
    this.currencyDisplayMode = value;
    this.filterByMarket(value, this.searchInput);
  }

  onSearch(value) {
    this.searchInput = value;
    this.filterByMarket(this.currencyDisplayMode, value);
  }

  filterTopMarket() {
    this.currencyPairsTop = this.currencyPairsCache
      .filter(pair => !!pair.topMarket);
  }

  filterByMarket(market: string, searchInput: string) {
    this.formatedPairs = this.choosePair(market, searchInput).slice(0, 10);
  }

  choosePair(market: string, searchValue: string = ''): CurrencyPair[] {
    if (searchValue) {
      return this.currencyPairsCache.filter(
        pair => pair.currencyPairName.toUpperCase().startsWith(searchValue.toUpperCase())
      );
    }

    if (market === 'ALL') {
      return this.currencyPairsTop;
    }
    if (market === 'FAVORITES') {
      return this.currencyPairsCache.filter(pair => this.userFavorites.indexOf(pair.currencyPairId) >= 0);
    }
    if (market === 'LOC') {
      return this.currencyPairsTop.filter(
        f =>
          f.market &&
          f.market.toUpperCase() !== 'USD' &&
          f.market.toUpperCase() !== 'BTC' &&
          f.market.toUpperCase() !== 'ETH' &&
          f.market.toUpperCase() !== 'USDT'
      );
    }
    return this.currencyPairsTop.filter(
      f =>
        f.market &&
        f.market.toUpperCase() === market.toUpperCase()
    );

  }

  onClickMarketItem(e) {
    if (e.target === e.currentTarget) {
      return;
    }

    let target = e.target;

    while (target.id !== 'markets-container' || null) {
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

  onSelectCurrencyPair(pair: CurrencyPair): void {
    if (this.isMobile) {
      const newActivePair = new SimpleCurrencyPair(pair.currencyPairId, pair.currencyPairName);
      this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(newActivePair));
      this.utilsService.saveActiveCurrencyPairToSS(newActivePair);
      this.userService.getUserBalance(newActivePair);
      this.router.navigate(['/dashboard'], {
        queryParams: { widget: 'trading' },
      });
    } else {
      this.router.navigate([`/markets/${pair.currencyPairName.replace('/', '-')}`]);
    }
    this.marketSearch = false;
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

  getIsFavorite(currencyPairId) {
    return this.userFavorites.indexOf(currencyPairId) >= 0;
  }

  getPairById(pairId: number): CurrencyPair {
    return this.currencyPairsCache.find(item => item.currencyPairId === pairId);
  }

  trackByPairs(index, item) {
    return item.currencyPairId;
  }

  breakpointSub() {
    this.breakpointService.breakpoint$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res === 'mobile') {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

}
