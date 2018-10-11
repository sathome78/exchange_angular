import {Component, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.itemName = 'markets';
  }

}
