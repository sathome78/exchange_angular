import {Component, OnInit} from '@angular/core';
import {AbstractDashboardItems} from '../abstract-dashboard-items';


@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss']
})
export class TradeHistoryComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.itemName = 'trade-history';
  }

}
