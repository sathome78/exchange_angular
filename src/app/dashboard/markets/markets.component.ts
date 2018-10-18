import {Component, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {MockDataService} from '../../services/mock-data.service';
import {DashboardDataService} from '../dashboard-data.service';
import {CurrencyPair} from '../../shared/models/currency-pair.model';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;
  /** Markets data from server */
  public marketsData;
  /** Markets data by active tab */
  public showMarketsData;
  /** active tab pair */
  public activeTab = 'BTC';

  constructor(
    public mockData: MockDataService,
    public dashboardService: DashboardDataService
  ) {
    super();
  }

  ngOnInit() {
    this.marketsData = this.mockData.getMarketsData();
    this.showMarketsData = this.choosePair(this.activeTab);
    this.itemName = 'markets';
  }

  /**
   * Filter data on select tab
   * @param {string} value
   */
  selectedTab(value: string): void {
    this.activeTab = value;
    this.showMarketsData = this.choosePair(value);
  }

  /**
   * Return array by market
   * @param {string} market
   * @returns {CurrencyPair[]}
   */
  choosePair(market: string): CurrencyPair[] {
    return this.marketsData.filter(f => f.market.toLowerCase() === market.toLowerCase());
  }

  /**
   * Talk about change current pair
   * @param {CurrencyPair} pair
   */
  selectPair(pair: CurrencyPair): void {
    this.dashboardService.choosedPair$.next(pair);
  }

  /** Filter markets data by search-data*/
  searchPair(event: string): void {
    this.showMarketsData = this.choosePair(this.activeTab).filter(f => f.currencyPairName.toLowerCase().match(event.toLowerCase()));
  }

  isChangePositive(pair: CurrencyPair): boolean {
      return pair.lastOrderRate > pair.predLastOrderRate;
  }
}
