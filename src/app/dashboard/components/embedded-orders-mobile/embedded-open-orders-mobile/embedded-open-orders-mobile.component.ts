import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {EmbeddedOrdersService} from '../../embedded-orders/embedded-orders.service';

@Component({
  selector: 'app-embedded-open-orders-mobile',
  templateUrl: './embedded-open-orders-mobile.component.html',
  styleUrls: ['./embedded-open-orders-mobile.component.scss']
})
export class EmbeddedOpenOrdersMobileComponent implements OnInit, OnChanges {

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('openOrders')) {
    }
  }

  cancelOrder(order) {
    this.showCancelOrderConfirm = null;
    this.ordersService.deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.refreshOpenOrders.emit(true);
      });
  }
}
