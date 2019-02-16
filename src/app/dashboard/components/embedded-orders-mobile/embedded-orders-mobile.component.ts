import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {getCurrencyPair, getLastCreatedOrder, State} from '../../../core/reducers';
import {takeUntil} from 'rxjs/operators';
import {CurrencyPair} from '../../../model';
import {EmbeddedOrdersService} from '../embedded-orders/embedded-orders.service';
import {Order} from '../../../model/order.model';

@Component({
  selector: 'app-embedded-orders-mobile',
  templateUrl: './embedded-orders-mobile.component.html',
  styleUrls: ['./embedded-orders-mobile.component.scss']
})
export class EmbeddedOrdersMobileComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public mainTab = 'open';
  public openOrdersCount = 0;
  public historyOrders;
  public openOrders;
  public activeCurrencyPair: CurrencyPair;

  constructor(
    private store: Store<State>,
    private ordersService: EmbeddedOrdersService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((pair: CurrencyPair) => {
        this.activeCurrencyPair = pair;
        this.toOpenOrders();
        this.toHistory();
      });

    this.store
      .pipe(select(getLastCreatedOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((order: Order) => {
        this.toOpenOrders();
        this.toHistory();
      });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * switch main tab
   * @param {string} tabName
   */
  toggleMainTab(tabName: string): void {
    this.mainTab = tabName;
    this.mainTab === 'open' ?
      this.toOpenOrders() :
      this.toHistory();
  }

  /**
   * request to get open-orders data
   */
  toOpenOrders(): void {
    this.ordersService.getOpenOrders(this.activeCurrencyPair.currencyPairId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.openOrders = data.items;
        this.openOrdersCount = data.count;
        this.cdr.detectChanges();
      });
  }

  /**
   * request to get history data with status (CLOSED and CANCELED)
   */
  toHistory(): void {
    this.ordersService.getHistory(this.activeCurrencyPair.currencyPairId, 'CLOSED')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.historyOrders = data.items;
        this.cdr.detectChanges();
      });

  }

}
