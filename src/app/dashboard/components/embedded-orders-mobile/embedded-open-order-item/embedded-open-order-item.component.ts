import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EmbeddedOrdersService} from '../../embedded-orders/embedded-orders.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-embedded-open-order-item',
  templateUrl: './embedded-open-order-item.component.html',
  styleUrls: ['./embedded-open-order-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedOpenOrderItemComponent implements OnInit {

  @Input() item;
  @Output() refreshOpenOrders: EventEmitter<boolean> = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public selectedOrder;
  public showCancelOrderConfirm;

  constructor(
    private ordersService: EmbeddedOrdersService,
  ) { }

  ngOnInit() {}

  toggleDetails(order) {
    this.selectedOrder = this.selectedOrder && this.selectedOrder.id === order.id ? null : order;
  }

  onShowCancelOrderConfirm(id) {
    this.showCancelOrderConfirm = id;
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
