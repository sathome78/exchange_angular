import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {EmbeddedOrdersService} from '../../embedded-orders/embedded-orders.service';

@Component({
  selector: 'app-embedded-open-orders-mobile',
  templateUrl: './embedded-open-orders-mobile.component.html',
  styleUrls: ['./embedded-open-orders-mobile.component.scss']
})
export class EmbeddedOpenOrdersMobileComponent implements OnInit {

  @Output() refreshOpenOrders: EventEmitter<boolean> = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() openOrders = [];
  public selectedOrder;
  public showCancelOrderConfirm;

  constructor(
    private ordersService: EmbeddedOrdersService,
  ) {
  }

  ngOnInit() {
  }

  toggleDetails(order) {
      this.selectedOrder = this.selectedOrder && this.selectedOrder.id === order.id ? null : order;
  }


  onShowCancelOrderConfirm(id) {
    this.showCancelOrderConfirm = id;
  }

  cancelOrder(order) {
    this.ordersService.deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.refreshOpenOrders.emit(true);
      });
  }
}
