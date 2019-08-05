import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { SimpleCurrencyPair } from '../../../../model/simple-currency-pair';

@Component({
  selector: 'app-embedded-orders-history-mobile',
  templateUrl: './embedded-orders-history-mobile.component.html',
  styleUrls: ['./embedded-orders-history-mobile.component.scss'],
})
export class EmbeddedOrdersHistoryMobileComponent implements OnInit {
  @Input() historyOrders = [];
  @Input() isVipUser: boolean = false;
  @Input() currentPair: SimpleCurrencyPair;
  public arrPairName = ['', ''];
  public selectedOrder = null;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.arrPairName = this.currentPair.name.split('/');
  }

  toggleDetails(order) {
    this.selectedOrder = this.selectedOrder && this.selectedOrder.id === order.id ? null : order;
  }

  currency(currName: string, currIndex: number): string {
    const curr = currName.split('/');
    return curr[currIndex - 1];
  }

  setClassForOrderTypeField(type: string): string {
    let className: string;
    if (type) {
      className = 'orders__type-' + type.toLocaleLowerCase();
    } else {
      className = '';
    }

    return className;
  }

  trackByFn(index, item) {
    return item.id;
  }
}
