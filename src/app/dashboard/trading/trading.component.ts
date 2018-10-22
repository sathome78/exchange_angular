import {Component, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Order} from './order.model';
import {TradingService} from './trading.service';
import {MarketService} from '../markets/market.service';
import {MockDataService} from '../../services/mock-data.service';
import {DashboardDataService} from '../dashboard-data.service';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})
export class TradingComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;
  /** active sell/buy tab */
  public mainTab = 'BUY';
  /** toggle for limits-dropdown */
  public isDropdownOpen = false;
  /** dpropdown limit data */
  public limitsData = ['Limit', 'Stop limit', 'ICO'];
  /** selected limit */
  public dropdownLimitValue = this.limitsData[0];
  /** selected percent */
  public percents;
  /** form for limit-order */
  limitForm: FormGroup;
  /** form for limit-order */
  stopForm: FormGroup;

  public userMoney = 3000000000;
  public orderStop;
  public currentPair;
  public arrPairName: string[];

  constructor(
    public tradingService: TradingService,
    private marketService: MarketService,
    private mockData: MockDataService,
    private dashboardDataService: DashboardDataService,
  ) {
    super();
  }

  public defaultOrder: Order = {
    orderType: this.mainTab,
    orderId: 0,
    currencyPairId: null,
    amount: null,
    rate: null,
    commission: null,
    baseType: this.dropdownLimitValue,
    total: null,
  };
  public order;

  ngOnInit() {
    this.itemName = 'trading';
    this.order = {...this.defaultOrder};
    this.currentPair = this.mockData.getMarketsData()[2];
    this.splitPairName();
    this.marketService.activeCurrencyListener.subscribe(pair => {
      this.currentPair = pair;
      this.splitPairName();
    });
    this.dashboardDataService.selectedOrderTrading$.subscribe(order => {
      this.orderFromOrderBook(order);
      console.log(order);
    })
    this.initForms();
  }

  /**
   * init forms
   */
  initForms(): void {
    this.limitForm = new FormGroup({
      quantityOf: new FormControl('', Validators.required ),
      priceIn: new FormControl('', Validators.required ),
      totalIn: new FormControl('', Validators.required ),
    });

    this.stopForm = new FormGroup({
      quantityOf: new FormControl('', Validators.required ),
      stop: new FormControl('', [Validators.required]),
      limit: new FormControl('', Validators.required ),
      totalIn: new FormControl('', Validators.required ),
    });
  }

  /**
   * toggle sell/buy tabs and emit this
   * @param {string} tab
   */
  toggleMainTab(tab: string) {
    if (tab === 'BUY') {
      this.mainTab = 'BUY';
      this.tradingService.tradingChangeSellBuy$.next('BUY');
    } else  {
      this.mainTab = 'SELL';
      this.tradingService.tradingChangeSellBuy$.next('SELL');
    }
  }

  /**
   * Toggle limit dropdown
   */
  toggleLimitDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * On select limit
   * @param {string} limit
   */
  selectedLimit(limit: string): void {
    this.dropdownLimitValue = limit;
    this.percents = null;
  }

  /**
   * on select checkbox of percents
   * @param {number} percent
   */
  selectedPercent(percent: number) {
    this.percents = percent;
    const quantityOf = this.userMoney * this.percents / 100;
    this.dropdownLimitValue === this.limitsData[0] ?
      this.limitForm.controls['quantityOf'].setValue(quantityOf) :
      this.stopForm.controls['quantityOf'].setValue(quantityOf);
    this.order.total = quantityOf * this.currentPair.lastOrderRate;
  }

  quantityIput(e) {
    this.order.total = e.target.value * this.currentPair.lastOrderRate;
    this.percents = null;
  }

  private splitPairName() {
    this.arrPairName = this.currentPair.currencyPairName.split('/');
  }

  orderFromOrderBook(order) {
    this.order.orderId = order.id;
    this.order.amount = order.amountBase;
    this.order.total = order.amountBase * this.currentPair.lastOrderRate;
  }

  onSubmit() {
    this.order.currencyPairId = this.currentPair.currencyPairId;
    this.order.baseType = this.dropdownLimitValue;
    this.order.orderType = this.mainTab;
    if (this.dropdownLimitValue === 'Stop limit') {
      this.order.stop = this.orderStop;
    }
   this.order.orderId === 0 ? this.createNewOrder() : this.updateOrder();
  }

  createNewOrder() {
    this.tradingService.createOrder(this.order).subscribe(res => console.log(res));
    console.log(this.order);
    this.percents = null;
    this.order = {...this.defaultOrder};
  }

  updateOrder() {

  }

}
