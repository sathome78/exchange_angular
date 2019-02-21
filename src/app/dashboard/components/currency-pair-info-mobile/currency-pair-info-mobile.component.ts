import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {UserBalance} from 'app/model/user-balance.model';
import {State, getActiveCurrencyPair, getUserBalance, getCurrencyPairInfo, getCurrencyPairArray} from 'app/core/reducers/index';
import {DashboardWebSocketService} from '../../dashboard-websocket.service';
import {CurrencyPairInfo} from '../../../model/currency-pair-info.model';
import {UtilsService} from 'app/shared/services/utils.service';
import * as dashboardActions from '../../actions/dashboard.actions';
/**
 * Dashboard currency pair information component
 */
@Component({
  selector: 'app-currency-pair-info-mobile',
  templateUrl: 'currency-pair-info-mobile.component.html',
  styleUrls: ['currency-pair-info-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyPairInfoMobileComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public pair: CurrencyPair = null;
  public pairInput: string = ''
  public currentCurrencyInfo: CurrencyPairInfo = null;
  public userBalanceInfo: UserBalance;
  public allCurrencyPairs: CurrencyPair[] = [];
  public DIOptions: DIOptions[] = [];
  public isIncrease: boolean = false;

  constructor(
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private cdr: ChangeDetectorRef,
    private utils: UtilsService,
  ) { }

  ngOnInit() {
    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.pair = pair;
        this.pairInput = pair.currencyPairName;
        this.updateCurrencyInfo(pair.currencyPairId);
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPairInfo) => {
        this.currentCurrencyInfo = pair;
        this.isIncrease = this.getIsIncrease();
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair[]) => {
        this.allCurrencyPairs = pair;
        this.DIOptions = pair.map((item) => ({text: item.currencyPairName, id: item.currencyPairId}));
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      });

    // this.dashboardWebsocketService.setRabbitStompSubscription()
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((currencyPair) => {
    //     console.log(currencyPair)
    //     this.updateCurrencyInfo(currencyPair.currencyPairId);
    //   })
  }

  updateCurrencyInfo(currencyPairId) {
    this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(currencyPairId))
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getIsIncrease() {
    return this.currentCurrencyInfo ? this.currentCurrencyInfo.currencyRate - this.currentCurrencyInfo.lastCurrencyRate >= 0 : false;
  }

  onChangeCurrPair(val: string): void {
    this.pairInput = val;
  }

  onSelectPair(pairName: string): void {
    this.dashboardWebsocketService.findPairByCurrencyPairName(pairName);
  }

  isFiat(currNum) {
    const currs = this.pair.currencyPairName.split('/');
    return this.utils.isFiat(currs[currNum - 1]);
  }

}
