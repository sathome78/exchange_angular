import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-embedded-orders-history-mobile',
  templateUrl: './embedded-orders-history-mobile.component.html',
  styleUrls: ['./embedded-orders-history-mobile.component.scss']
})
export class EmbeddedOrdersHistoryMobileComponent implements OnInit {

  @Input() historyOrders;
  constructor() { }

  ngOnInit() {
  }

  /**
   * sets class for order type field
   * @param {string} type ordert type: examples: 'buy', 'sell', 'stop'
   * @returns {string}
   */
  setClassForOrderTypeField (type: string): string {
    let className: string;
    if (type) {
      className = 'orders__type-' + type.toLocaleLowerCase();
    } else {
      className = '';
    }

    return className;
  }

  /**
   * open submenu in the mobile version of the table
   * @param event
   */
  toggleDetails(event: MouseEvent): void {
    const element: HTMLElement = <HTMLElement>event.currentTarget;
    const idDetails = element.dataset.id;
    if (idDetails) {
      const detailsElement = document.getElementById(idDetails + '');
      if (detailsElement) {
        detailsElement.classList.toggle('table__details-show');
      }
    }
  }
}
