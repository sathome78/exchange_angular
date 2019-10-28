import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { EmbeddedOrdersService } from '../../embedded-orders/embedded-orders.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SimpleCurrencyPair } from '../../../../model/simple-currency-pair';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-embedded-open-orders-mobile',
  templateUrl: './embedded-open-orders-mobile.component.html',
  styleUrls: ['./embedded-open-orders-mobile.component.scss'],
})
export class EmbeddedOpenOrdersMobileComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() openOrders = [];
  @Input() currentPair: SimpleCurrencyPair;
  public selectedOrder = null;
  public showCancelOrderConfirm = null;
  public loading = false;

  constructor(private ordersService: EmbeddedOrdersService, private userService: UserService) {}

  ngOnInit() {}

  toggleDetails(order) {
    this.selectedOrder = this.selectedOrder && this.selectedOrder.id === order.id ? null : order;
  }

  onShowCancelOrderConfirm(id) {
    this.showCancelOrderConfirm = id;
  }

  cancelOrder(order) {
    this.showCancelOrderConfirm = null;
    this.loading = true;
    this.ordersService
      .deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          this.loading = false;
          const pair = new SimpleCurrencyPair(order.currencyPairId, order.currencyPairName);
          this.userService.getUserBalance(pair);
        },
        err => {
          this.loading = false;
          console.error(err);
        }
      );
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackByFn(index, item) {
    return item.id;
  }
}
