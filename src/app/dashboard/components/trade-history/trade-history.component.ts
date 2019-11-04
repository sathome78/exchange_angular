import { Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy,Input } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/Subject';

import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { CurrencyPair } from '../../../model/currency-pair.model';
import { select, Store } from '@ngrx/store';
import { State, getActiveCurrencyPair, getAllTrades } from 'app/core/reducers/index';
import { TradeItem } from '../../../model/trade-item.model';
import { Subscription } from 'rxjs';
import { DashboardWebSocketService } from 'app/dashboard/dashboard-websocket.service';
import { SetAllTradesAction } from 'app/dashboard/actions/dashboard.actions';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { Animations } from 'app/shared/animations';

@Component({
  selector: 'app-trade-history',
  templateUrl: 'trade-history.component.html',
  styleUrls: ['trade-history.component.scss'],
  animations: [Animations.componentTriggerShowOrderBook],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeHistoryComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;
  private tradesSub$: Subscription;
  @Input() public tHistoryOffset;
  allTrades: TradeItem[] = [];
  personalTrades: TradeItem[] = [];

  activeCurrencyPair: SimpleCurrencyPair;
  currencySubscription: any;

  allTradesSubscription: any;
  personalTradesSubscription: any;

  secondCurrency;
  firstCurrency;
  public loading: boolean;
  public showContent1 = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  userInSystem: boolean;

  constructor(
    private store: Store<State>,
    private dashboardWebsocketService: DashboardWebSocketService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    if (document.documentElement.clientWidth > 1199) {
      setTimeout(() => {
        this.showContent1 = true;
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      }, this.tHistoryOffset);
    }
    if (document.documentElement.clientWidth < 1199) {
      this.showContent1 = true;
      if (!this.cdr['destroyed']) {
        this.cdr.detectChanges();
      }
    }
    this.itemName = 'trade-history';

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: SimpleCurrencyPair) => {
        if (pair.id) {
          this.onGetCurrentCurrencyPair(pair);
        }
      });

    this.store
      .pipe(select(getAllTrades))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(orders => {
        this.addOrUpdate(this.allTrades, orders);
        /** sort items */
        this.allTrades.sort((a, b) => {
          let timeA;
          let timeB;
          timeA = parseInt(a.acceptionTime, 10);
          timeB = parseInt(b.acceptionTime, 10);
          return timeB - timeA;
        });
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.unsubscribeTrades();
  }

  subscribeTrades(currName: string): void {
    this.unsubscribeTrades();
    this.loadingStarted();
    const pairName = currName.toLowerCase().replace(/\//i, '_');
    this.tradesSub$ = this.dashboardWebsocketService
      .allTradesSubscription(pairName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.store.dispatch(new SetAllTradesAction(data));
        this.loadingFinished();
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });
  }

  unsubscribeTrades() {
    if (this.tradesSub$) {
      this.tradesSub$.unsubscribe();
    }
  }

  addOrUpdate(oldItems: TradeItem[], newItems: TradeItem[]) {
    if (oldItems.length === 0) {
      oldItems.push(...newItems);
      return;
    }
    newItems.forEach(newItem => {
      let found = false;
      oldItems.forEach(oldItem => {
        if (oldItem.orderId === newItem.orderId) {
          // tslint:disable-next-line: no-parameter-reassignment
          oldItem = TradeItem.deepCopy(newItem);
          found = true;
        }
      });
      if (!found) {
        oldItems.push(newItem);
      }
    });
  }

  formattingCurrentPairName(currentPair: string): void {
    /** search slash position */
    if (currentPair) {
      let index: number;
      index = currentPair.match(/\+|-|\/|\*/).index;

      this.firstCurrency = currentPair.slice(0, index);
      this.secondCurrency = currentPair.slice(index + 1);
    }
  }

  private onGetCurrentCurrencyPair(pair: SimpleCurrencyPair) {
    this.activeCurrencyPair = pair;
    this.store.dispatch(new SetAllTradesAction([]));
    this.subscribeTrades(pair.name);
    this.allTrades = [];
    this.personalTrades = [];
    this.formattingCurrentPairName(pair.name as string);
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
  }

  trackByFn(index, item) {
    return item.orderId; // or item.id
  }

  private loadingFinished(): void {
    this.loading = false;
  }
  private loadingStarted(): void {
    this.loading = true;
  }
}
