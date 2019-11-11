import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/internal/operators';
import { EmbeddedOrdersService } from '../embedded-orders.service';
import { Store } from '@ngrx/store';
import { State } from 'app/core/reducers/index';
import { TradingService } from 'app/dashboard/services/trading.service';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-embedded-open-orders',
  templateUrl: './embedded-open-orders.component.html',
  styleUrls: ['./embedded-open-orders.component.scss'],
})
export class EmbeddedOpenOrdersComponent implements OnInit, OnDestroy {
  @Input() makeHeight;
  @Input() currentPair: SimpleCurrencyPair;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() openOrders;

  public orderType = 'BUY';
  public order;
  public userBalance = 0;

  public currentPage = 1;
  public showCancelOrder = null;
  public loading = false;

  constructor(
    private userService: UserService,
    private ordersService: EmbeddedOrdersService,
    public tradingService: TradingService
  ) {}

  ngOnInit() { }


  /**
   * set status order canceled
   * @param order
   */
  cancelOrder(order): void {
    this.loading = true;
    this.ordersService
      .deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          this.loading = false;
          const pair = new SimpleCurrencyPair(order.currencyPairId, order.currencyPairName);
          this.userService.getUserBalance(pair);
          this.showCancelOrder = null;
        },
        err => {
          this.loading = false;
          this.showCancelOrder = null;
        }
      );
  }

  onShowCancelOrderConfirm(order): void {
    this.showCancelOrder = order;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByFn(index, item) {
    return item.id;
  }

  get firstCurr() {
    return this.currentPair && this.currentPair.name && this.currentPair.name.split('/')[0];
  }
  get secondCurr() {
    return this.currentPair && this.currentPair.name && this.currentPair.name.split('/')[1];
  }
}
