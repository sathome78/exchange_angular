import {Component, OnInit, OnDestroy, HostListener, Renderer2} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';

import {DashboardService} from '../../dashboard.service';
import {Currency} from './currency-search/currency.model';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {UserBalance} from 'app/model/user-balance.model';
import {State, getCurrencyPair, getUserBalance, getCurrencyPairInfo, getCurrencyPairArray} from 'app/core/reducers/index';
import {DashboardWebSocketService} from '../../dashboard-websocket.service';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';
import {UtilsService} from 'app/shared/services/utils.service';
import * as dashboardActions from '../../actions/dashboard.actions';
import {UserService} from 'app/shared/services/user.service';
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
  public pair: CurrencyPair = null;
  public pairInput: string = ''
  public currentCurrencyInfo: CurrencyPairInfo = null;
  public userBalanceInfo: UserBalance;
  public allCurrencyPairs: CurrencyPair[] = [];
  public DIOptions: DIOptions[] = [];

  constructor(
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private userService: UserService,
    private utils: UtilsService,
  ) { }

  ngOnInit() {
    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.pair = pair;
        this.pairInput = pair.currencyPairName;
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currentCurrencyInfo = pair;
      });

    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair[]) => {
        this.allCurrencyPairs = pair;
        this.DIOptions = pair.map((item) => ({text: item.currencyPairName, id: item.currencyPairId}));
      });

    this.store
      .pipe(select(getUserBalance))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((balance: UserBalance) => {
        if (balance.cur1 && balance.cur2) {
          this.userBalanceInfo = balance;
        } else {
          this.userBalanceInfo = null;
        }
      });

    this.dashboardWebsocketService.setRabbitStompSubscription()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currencyPair) => {
        console.log(currencyPair)
        this.updateCurrencyInfo(currencyPair.currencyPairId);
      })
  }

  updateCurrencyInfo(currencyPairId) {
    this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(currencyPairId))
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  flarForArrow(s: string) {
    if (s === 'up') {
      return this.currentCurrencyInfo ? this.currentCurrencyInfo.currencyRate - this.currentCurrencyInfo.lastCurrencyRate >= 0 :  false;
    } else {
      return this.currentCurrencyInfo ? this.currentCurrencyInfo.currencyRate - this.currentCurrencyInfo.lastCurrencyRate < 0 : false;
    }
  }

  onChangeCurrPair(val: string): void {
    this.pairInput = val;
  }



  onSelectPair(pairName: string): void {
    const p = this.findCurrencyPair(pairName);
    if(p) {
      this.selectNewCurrencyPair(p);
    } else {
      this.pairInput = this.pair.currencyPairName;
    }
  }

  onBlurInput() {
    const p = this.findCurrencyPair(this.pairInput);
    if(p) {
      this.selectNewCurrencyPair(p);
    } else {
      this.pairInput = this.pair.currencyPairName;
    }
  }

  findCurrencyPair(val: string): CurrencyPair | null {
    return this.allCurrencyPairs.find((item) => item.currencyPairName === val) || null;
  }

  selectNewCurrencyPair(pair: CurrencyPair) {
    this.store.dispatch(new dashboardActions.ChangeCurrencyPairAction(pair));
    this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(pair.currencyPairId))
    this.userService.getUserBalance(pair);
  }


  isFiat(currNum) {
    const currs = this.pair.currencyPairName.split('/');
    return this.utils.isFiat(currs[currNum - 1]);
  }

}
