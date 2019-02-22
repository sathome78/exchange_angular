import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-embedded-open-orders-mobile',
  templateUrl: './embedded-open-orders-mobile.component.html',
  styleUrls: ['./embedded-open-orders-mobile.component.scss']
})
export class EmbeddedOpenOrdersMobileComponent implements OnInit {

  @Output() refreshOpenOrders: EventEmitter<boolean> = new EventEmitter();
  @Input() openOrders = [];
  public selectedOrder;
  public showCancelOrderConfirm;

  constructor() {
  }

  ngOnInit() {
    console.log(this.openOrders)
  }

  toggleDetails(order) {
    this.selectedOrder = order;
  }


  onShowCancelOrderConfirm(id) {
    this.showCancelOrderConfirm = id;
  }

  cancelOrder(item) {

  }
}
