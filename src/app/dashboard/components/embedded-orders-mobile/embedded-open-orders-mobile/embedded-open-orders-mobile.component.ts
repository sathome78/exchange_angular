import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy} from '@angular/core';
import { EmbeddedOrdersService } from '../../embedded-orders/embedded-orders.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-embedded-open-orders-mobile',
  templateUrl: './embedded-open-orders-mobile.component.html',
  styleUrls: ['./embedded-open-orders-mobile.component.scss']
})
export class EmbeddedOpenOrdersMobileComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Output() refreshOpenOrders: EventEmitter<boolean> = new EventEmitter();
  @Input() openOrders = [];
  public selectedOrder = null;
  public showCancelOrderConfirm = null;
  public loading: boolean = false;

  constructor(
    private ordersService: EmbeddedOrdersService,
  ) {}

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
    this.ordersService.deleteOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.refreshOpenOrders.emit(true);
        this.loading = false;
      }, (err) => {
        this.loading = false;
        console.error(err);
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
