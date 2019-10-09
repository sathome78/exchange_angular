import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/internal/operators';
import { EmbeddedOrdersService } from '../embedded-orders.service';
import { Store } from '@ngrx/store';
import { State } from 'app/core/reducers/index';
import { TradingService } from 'app/dashboard/services/trading.service';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';

@Component({
  selector: 'app-embedded-open-orders',
  templateUrl: './embedded-open-orders.component.html',
  styleUrls: ['./embedded-open-orders.component.scss'],
})
export class EmbeddedOpenOrdersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() makeHeight;
  @Input() currentPair: SimpleCurrencyPair;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() openOrders;
  @Input() countPerPage = 7;

  public orderType = 'BUY';
  public order;
  public userBalance = 0;
  public arrPairName = ['', ''];

  public currentPage = 1;
  public showCancelOrderConfirm = null;
  public loading = false;

  constructor(
    private store: Store<State>,
    private ordersService: EmbeddedOrdersService,
    public tradingService: TradingService
  ) {}

  ngOnInit() {
    this.arrPairName = this.currentPair.name.split('/');
  }

  /**
   * filter open orders
   */
  changePage(page: number): void {
    this.currentPage = page;
    this.showCancelOrderConfirm = null;
  }

  /**
   * Change count items when we make height bigger
   * @param changes
   */
  ngOnChanges(changes): void {
    if (changes.openOrders) {
      this.arrPairName = this.currentPair.name.split('/');
    }
    if (!changes.makeHeight) {
      return;
    }
    // change count orders perPage
    this.countPerPage = changes.makeHeight.currentValue === true ? 7 : 18;
  }

  /**
   * set status order canceled
   * @param order
   */
  cancelOrder(order): void {
    this.loading = true;
    this.showCancelOrderConfirm = null;
    this.ordersService
      .deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          this.loading = false;
        },
        err => {
          this.loading = false;
        }
      );
  }

  onShowCancelOrderConfirm(orderId: string | null): void {
    this.showCancelOrderConfirm = orderId;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByFn(index, item) {
    return item.id;
  }
}
