import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-embedded-orders-history-mobile',
  templateUrl: './embedded-orders-history-mobile.component.html',
  styleUrls: ['./embedded-orders-history-mobile.component.scss']
})
export class EmbeddedOrdersHistoryMobileComponent implements OnInit {

  @Input() historyOrders = [];
  public selectedOrder = null;

  constructor(
    public authService: AuthService
  ) {}

  ngOnInit() {}

  toggleDetails(order) {
    this.selectedOrder = this.selectedOrder && this.selectedOrder.id === order.id ? null : order;
  }

  setClassForOrderTypeField (type: string): string {
    let className: string;
    if (type) {
      className = 'orders__type-' + type.toLocaleLowerCase();
    } else {
      className = '';
    }

    return className;
  }
}
