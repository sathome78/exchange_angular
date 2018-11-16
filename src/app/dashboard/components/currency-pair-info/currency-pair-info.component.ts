import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';

import { DashboardService } from '../../dashboard.service';
import { Currency } from './currency-search/currency.model';
import {MarketService} from '../markets/market.service';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {UserBalance} from 'app/model/user-balance.model';
import {State, getCurrencyPair, getUserBalance, getCurrencyPairInfo} from 'app/core/reducers/index';
import {DashboardWebSocketService} from '../../dashboard-websocket.service';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';

/**
 * Dashboard currency pair information component
 */
@Component({
  selector: 'app-currency-pair-info',
  templateUrl: 'currency-pair-info.component.html',
  styleUrls: ['currency-pair-info.component.scss']
})
export class CurrencyPairInfoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** show currency search bar */
  showCurrencySearch: boolean;
  /** available currencies */
  currencies: Currency[];
  /** current active pair */
  public pair;
  public firstCurrency: string;
  public secondCurrency: string;
  public activeCurrency: number;
  public currentCurrencyInfo;
  public userBalanceInfo: UserBalance;

  constructor(
    private store: Store<State>,
    private dashboardService: DashboardService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private marketService: MarketService,
  ) { }

  ngOnInit() {
    this.dashboardService.getCurrencies()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: Currency[]) => this.currencies = value);

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair) => {
        this.pair = pair;
        this.splitPairName(this.pair);
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPairInfo) => {
        this.currentCurrencyInfo = pair;
      });

    this.store
      .pipe(select(getUserBalance))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (balance: UserBalance) => {
        if (balance.balanceByCurrency1) {
          this.userBalanceInfo = balance;
        } else {
          this.userBalanceInfo = null;
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Show currency search bar
   */
  openSearchBar(currencyOrder: number): void {
    this.activeCurrency = currencyOrder;
    this.toggleCurrencySearch();
  }

  /**
   * Toggle show/hide currency search bar
   */
  toggleCurrencySearch(): void {
    this.showCurrencySearch = !this.showCurrencySearch;
  }

  /**
   * Selected currency
   * @param ISO
   */
  onSelectCurrency(ISO: string): void {
    const pairName = this.createCurrencyPairName(ISO);
    this.dashboardWebsocketService.findPairByCurrencyPairName(pairName);
  }

  /**
   * create currency pair name
   * @param {string} newCurrency
   * @returns {string}
   */
  createCurrencyPairName(newCurrency: string): string {
    if (this.activeCurrency === 0) {
      this.firstCurrency = newCurrency;
    }if (this.activeCurrency === 1) {
      this.secondCurrency = newCurrency;
    }
    return `${this.firstCurrency}/${this.secondCurrency}`;
  }

  /**
   * split pair name by '/'
   * @param {CurrencyPair} pair
   */
  splitPairName(pair: CurrencyPair) {
    if (pair.currencyPairId) {
      [ this.firstCurrency, this.secondCurrency ] = this.pair.currencyPairName.split('/');
    }
  }

  private getCurrencyPairInfo(pair): void {
    if (pair.currencyPairId) {
      const infoSubscription = this.marketService.currencyPairInfo(pair.currencyPairId)
        .subscribe(res => {
          this.currentCurrencyInfo = res;
          this.marketService.currentCurrencyInfoListener$.next(res);
          console.log(res)
          infoSubscription.unsubscribe();
        });
    }
  }
}
