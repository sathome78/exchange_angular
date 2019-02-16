import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-embedded-open-orders-mobile',
  templateUrl: './embedded-open-orders-mobile.component.html',
  styleUrls: ['./embedded-open-orders-mobile.component.scss']
})
export class EmbeddedOpenOrdersMobileComponent implements OnInit {

  public tableScrollStyles: any = {};
  @Input() openOrders;
  public showCancelOrderConfirm = null;

  constructor() {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {'height': (componentHeight - 112) + 'px', 'overflow': 'scroll'};
  }

  ngOnInit() {
  }

  toggleDetails(e) {}

  onShowCancelOrderConfirm(id) {}

  cancelOrder(item) {}
}
