import {Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {Order} from './order.model';
import {TradingService} from './trading.service';
import {MarketService} from '../markets/market.service';
import {DashboardService} from '../../dashboard.service';
import {BreakpointService} from 'app/services/breakpoint.service';
import {OrderBookService} from '../order-book/order-book.service';
import {CurrencyPipe} from 'app/shared/pipes/currency.pipe';
import {State, getCurrencyPair, getSelectedOrderBookOrder, getCurrencyPairInfo} from 'app/core/reducers/index';
import {CurrencyPair, CurrencyPairInfo} from 'app/model';
import {getUserBalance} from 'app/core/reducers';
import {UserBalance} from 'app/model/user-balance.model';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-trading',
  templateUrl: 'trading.component.html',
  styleUrls: ['trading.component.scss']
})
export class TradingComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName: string;
  /** active sell/buy tab */
  public mainTab ;
  /** toggle for limits-dropdown */
  public isDropdownOpen = false;
  /** dropdown limit data */
  public limitsData = ['LIMIT', 'MARKET_PRICE', 'STOP_LIMIT', 'ICO'];
  /** selected limit */
  public dropdownLimitValue = this.limitsData[0];
  /** form for limit-order */
  limitForm: FormGroup;
  /** form for limit-order */
  stopForm: FormGroup;

  public userBalance = 0;
  public orderStop;
  public currentPair;
  public arrPairName = ['', ''];
  private commissionIndex = 0.002;
  public notifySuccess = false;
  public notifyFail = false;
  public message = '';
  public currencyPairInfo;
  public order;
  public lastSellOrder;
  public lastSellBuyOrder;

  public defaultOrder: Order = {
    orderType: this.mainTab,
    orderId: 0,
    currencyPairId: null,
    amount: null,
    rate: null,
    commission: 0,
    baseType: this.dropdownLimitValue,
    status: 'OPENED',
    total: null,
  };

  @HostListener('document:click', ['$event']) clickout($event) {
    this.notifyFail = false;
    this.notifySuccess = false;
    if ($event.target.className !== 'dropdown__btn') {
      this.isDropdownOpen = false;
    }
  }

  constructor(
    private store: Store<State>,
    public breakPointService: BreakpointService,
    public tradingService: TradingService,
    public marketService: MarketService,
    private dashboardService: DashboardService,
    private orderBookService: OrderBookService,
    private userService: UserService,
    // private currencyUsdPipe: CurrencyPipe
  ) {
    super();
  }


  ngOnInit() {
    this.itemName = 'trading';
    this.mainTab = 'BUY';
    this.order = {...this.defaultOrder};
    this.initForms();

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair) => {
        this.onGetCurrentCurrencyPair(pair);
      });

    this.store
      .pipe(select(getUserBalance))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (balance: UserBalance) => {
        this.userBalance = balance.balanceByCurrency1 ? balance.balanceByCurrency1 : 0;
        this.userBalance = this.userBalance < 0 ? 0 : this.userBalance;
      });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPairInfo) => {
        this.limitForm.patchValue({'priceIn': pair.currencyRate});
      });


    this.store
      .pipe(select(getSelectedOrderBookOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (order) => {
        this.orderFromOrderBook(order);
      });

    this.dashboardService.selectedOrderTrading$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(order => {
        this.orderFromOrderBook(order);
      });

    this.orderBookService.lastOrderListener$.subscribe(res => {
      this.lastSellOrder = res;
    });

    this.dashboardService.lastBuySellOrderListener$.subscribe(res => {
      this.lastSellBuyOrder = res;
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      stop: new FormControl('', ),
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
    this.getCommissionIndex();
  }


  /**
   * Get readable limit string
   * @param {string} value
   * @returns {string}
   */
  showLimit(value: string): string {
    switch (value) {
      case 'LIMIT': {
        return 'Limit order';
      }
      case 'MARKET_PRICE': {
        return 'Market price';
      }
      case 'STOP_LIMIT': {
        return 'Stop limit';
      }
      case 'ICO': {
        return 'ICO order';
      }
    }
  }


  setRateOnSelectTypeOrder() {
    if (this.mainTab === 'BUY') {
      const tempData = !this.lastSellBuyOrder[0] ? 0 : this.lastSellBuyOrder[0].exrate;
      this.order.rate = parseFloat(tempData);
      this.setPriceInValue(this.order.rate);
      this.getCommission();
    } else {
      const tempData = !this.lastSellBuyOrder[1] ? 0 : this.lastSellBuyOrder[1].exrate;
      this.order.rate = parseFloat(tempData);
      this.setPriceInValue(this.order.rate);
      this.getCommission();
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
    // if (limit === 'MARKET_PRICE') {
    //   if (this.lastSellOrder) {
    //     this.order.rate = this.lastSellOrder ? this.lastSellOrder.exrate : 0;
    //     this.setPriceInValue(this.lastSellOrder ? this.lastSellOrder.exrate : 0);
    //     this.getCommission();
    //   }
    // }
    this.setRateOnSelectTypeOrder();
    this.isDropdownOpen = false;
  }

  /**
   * on select checkbox of percents
   * @param {number} percent
   */
  selectedPercent(percent: number) {
    const quantityOf = this.userBalance * percent / 100;
    this.order.amount = quantityOf;
    this.setQuantityValue(quantityOf);

    this.getCommission();
  }

  /**
   * on input in field quantity
   * @param e
   */
  quantityIput(e): void {

    this.order.amount = parseFloat(this.deleteSpace(e.target.value.toString()));
    this.setQuantityValue(e.target.value);
    this.getCommission();
  }

  deleteSpace(value) {
    if (value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }

  /**
   * on input in field price in
   * @param e
   */
   rateInput(e): void {
       this.order.rate = parseFloat(this.deleteSpace(e.target.value.toString()));
       this.getCommission();
   }

  stopInput(e) {
     this.orderStop = e.target.value;
  }
   totalInput(e): void {
     this.order.total = parseFloat(this.deleteSpace(e.target.value.toString()));
     // if (this.order.total > this.userBalance) {
     //   this.order.total = this.userBalance;
     //   this.setTotalInValue(this.userBalance);
     // }
     //   if (this.order.rate > 0) {
     //     this.order.amount = this.order.total / this.order.rate;
     //     this.setQuantityValue(this.order.amount);
     //   }

     this.order.rate = this.order.total   / this.order.amount;
     this.setPriceInValue(this.order.rate);
   }

  /**
   * split pair name for showing
   */
  private splitPairName() {
    if (this.currentPair.currencyPairName) {
      this.arrPairName = this.currentPair.currencyPairName.split('/');
    }
  }

  /**
   * set form value (quantityOf)
   * @param value
   */
  setQuantityValue(value): void {
    value = typeof value === 'string' ? value : value.toString();
    this.stopForm.controls['quantityOf'].setValue(value);
    this.limitForm.controls['quantityOf'].setValue(value);
  }

  /**
   * set form value (priceIn/limit)
   * @param value
   */
  setPriceInValue(value): void {
    value = typeof value === 'string' ? value : value.toString();
    this.stopForm.controls['limit'].setValue(value);
    this.limitForm.controls['priceIn'].setValue(value);
  }

  /**
   * set form value (totalIn)
   * @param value
   */
  setTotalInValue(value): void {
    value = typeof value === 'string' ? value : value.toString();
    this.stopForm.controls['totalIn'].setValue(value);
    this.limitForm.controls['totalIn'].setValue(value);
  }

  /**
   * set form value (stop)
   * @param value
   */
  setStopValue(value): void {
    this.stopForm.controls['stop'].setValue(value);
  }

  /**
   * Reset forms
   */
  resetForms(): void {
    this.limitForm.reset();
    this.stopForm.reset();
  }

  /**
   * fill model according to order-book order
   * @param order
   */
  orderFromOrderBook(order): void {
    this.dropdownLimitValue = this.limitsData[0];
    this.order.orderId = order.id;
    this.order.amount = order.amountConvert;
    this.setQuantityValue(this.order.amount);
    this.order.total = order.amountBase;
    this.setTotalInValue(this.order.total);
    this.order.rate = order.exrate;
    this.setPriceInValue(this.order.rate);
    this.mainTab = order.orderType;
    this.getCommission();
    }

  /**
   * on click submit button
   */
  onSubmit(): void {
    // window.open('https://exrates.me/dashboard', '_blank');


    if ( (this.stopForm.valid && this.orderStop && this.dropdownLimitValue === 'STOP_LIMIT') ||
      (this.limitForm.valid && this.dropdownLimitValue === 'LIMIT' || this.dropdownLimitValue === 'ICO' || this.dropdownLimitValue === 'MARKET_PRICE')) {

      this.order.currencyPairId = this.currentPair.currencyPairId;
      this.order.baseType = this.dropdownLimitValue;
      this.order.orderType = this.mainTab;
      if (this.dropdownLimitValue === 'STOP_LIMIT') {
        this.order.stop = this.orderStop;
      }
      this.order.orderId === 0 ? this.createNewOrder() : this.updateOrder();
      // console.log(this.order);
    }
  }

  /**
   * on create new order
   */
  createNewOrder(): void {
    this.tradingService.createOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.userService.getUserBalance(this.currentPair);
        console.log(res);
      this.notifySuccess = true;
      setTimeout(() => {this.notifySuccess = false; }, 5000);
    }, err => {
        console.log(err);
        this.notifyFail = true;
        setTimeout(() => {this.notifyFail = false; }, 5000);
      });
    this.orderStop = '';
    this.order = {...this.defaultOrder};
    this.resetForms();
    if (this.currencyPairInfo) {
      this.order.rate = this.currencyPairInfo.rate;
      this.setPriceInValue(this.currencyPairInfo.rate);
    }
  }

  /**
   * on update order from order-book
   */
  updateOrder(): void {
    this.tradingService.updateOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.userService.getUserBalance(this.currentPair);
        console.log(res);
        this.notifySuccess = true;
        setTimeout(() => {this.notifySuccess = false; }, 5000);
      }, err => {
        console.log(err);
        this.notifyFail = true;
        setTimeout(() => {this.notifyFail = false; }, 5000);
      });
    this.orderStop = '';
    this.resetForms();
    if (this.currencyPairInfo) {
      this.order.rate = this.currencyPairInfo.rate;
      this.setPriceInValue(this.currencyPairInfo.rate);
    }
  }

  /**
   * get commission index (send request)
   */
  getCommissionIndex() {
    if (this.mainTab && this.currentPair.currencyPairId) {
      const subscription = this.tradingService.getCommission(this.mainTab, this.currentPair.currencyPairId).subscribe(res => {
        this.commissionIndex = res.commissionValue;
        this.getCommission();
        subscription.unsubscribe();
      });
    }
  }

  /**
   * calculate commission
   */
  private getCommission(): void {
    if (this.order.rate && this.order.rate >= 0) {
      this.order.total = parseFloat(this.order.amount) * parseFloat(this.order.rate);
      this.order.commission = (this.order.rate * this.order.amount) * (this.commissionIndex / 100);
      let total;
      this.mainTab === 'BUY' ?
        total = this.order.total + parseFloat(this.order.commission) :
        total = this.order.total - parseFloat(this.order.commission);
      this.order.total = total;
      this.setTotalInValue(total);
    }
  }


  private onGetCurrentCurrencyPair(pair) {
    this.mainTab = 'BUY';
    this.currentPair = pair;
    this.order = {...this.defaultOrder};
    this.resetForms();
    this.splitPairName();
    this.getCommissionIndex();
  }
}
