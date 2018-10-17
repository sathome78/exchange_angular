import {Component, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {MockDataService} from '../../services/mock-data.service';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  public marketsData;
  public showMarketsData;

  public activeTab = 'BTC';

  constructor(
    public mockData: MockDataService,
  ) {
    super();
  }

  ngOnInit() {
    this.marketsData = this.mockData.getMarketsData();
    this.itemName = 'markets';
  }

  selectedTab(value: string) {
    this.activeTab = value;
  }

  addToFaborites(pair) {
    pair.favorite = !pair.favorite;
  }
}
