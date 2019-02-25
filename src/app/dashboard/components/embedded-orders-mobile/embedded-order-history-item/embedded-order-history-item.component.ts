import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-embedded-order-history-item',
  templateUrl: './embedded-order-history-item.component.html',
  styleUrls: ['./embedded-order-history-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedOrderHistoryItemComponent implements OnInit {
  @Input() item;
  public selectedOrder;

  constructor() { }

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
