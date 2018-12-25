import {Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {Order} from './order.model';
import {TradingService} from './trading.service';
import {DashboardService} from '../../dashboard.service';
import {BreakpointService} from 'app/shared/services/breakpoint.service';
import {OrderBookService} from '../order-book/order-book.service';
import {
  State,
  getCurrencyPair,
  getSelectedOrderBookOrder,
  getLastSellBuyOrder,
  getDashboardState,
  getCurrencyPairInfo
} from 'app/core/reducers/index';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {UserService} from 'app/shared/services/user.service';
import {LastSellBuyOrder} from 'app/model/last-sell-buy-order.model';
import {CurrencyPairInfo, OrderItem} from '../../../model';
import {environment} from '../../../../environments/environment';
import {PopupService} from '../../../shared/services/popup.service';
import {SelectedOrderBookOrderAction} from '../../actions/dashboard.actions';
import {defaultOrderItem} from '../../reducers/default-values';
import { AuthService } from 'app/shared/services/auth.service';

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
  public mainTab = 'BUY';
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
  public lastSellBuyOrders: LastSellBuyOrder;
  public isTotalWithCommission = false;

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
   /** Are listening click in document */
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
    private dashboardService: DashboardService,
    private popupService: PopupService,
    private orderBookService: OrderBookService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super();
  }


  ngOnInit() {
    this.itemName = 'trading';
    this.mainTab = 'BUY';
    this.order = {...this.defaultOrder};
    this.initForms();

    this.store
      .pipe(select(getDashboardState))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {
        this.userBalance = state.userBalance.balanceByCurrency1 ? state.userBalance.balanceByCurrency1 : 0;
        this.userBalance = this.userBalance < 0 ? 0 : this.userBalance;
      });

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair) => {
        this.onGetCurrentCurrencyPair(pair);
      });

    // this.store
    //   .pipe(select(getUserBalance))
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe( (balance: UserBalance) => {
    //     this.userBalance = balance.balanceByCurrency1 ? balance.balanceByCurrency1 : 0;
    //     this.userBalance = this.userBalance < 0 ? 0 : this.userBalance;
    //   });

    this.store
      .pipe(select(getCurrencyPairInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPairInfo) => {
        this.setPriceInValue(pair.currencyRate);
        this.order.rate = pair.currencyRate;
      });


    this.store
      .pipe(select(getSelectedOrderBookOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (order) => {
        this.orderFromOrderBook(order);
      });

    this.store
      .pipe(select(getLastSellBuyOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (lastOrders) => {
        this.lastSellBuyOrders = lastOrders;
      });

    // this.dashboardService.selectedOrderTrading$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(order => {
    //     this.orderFromOrderBook(order as OrderItem);
    //   });

    // this.orderBookService.lastOrderListener$.subscribe(res => {
    //   this.lastSellOrder = res;
    // });

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

  resetOrderBookItem(): void {
    if (this.tradingService.needSetDefaultOrderBookItem) {
      this.store.dispatch(new SelectedOrderBookOrderAction(defaultOrderItem));
    }
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

  /**
   * Set rate on select type order (depending on operation type)
   */
  setRateOnSelectTypeOrder(): void {
    if (this.mainTab === 'BUY') {
      const tempData = this.lastSellBuyOrders.lastBuyOrder.rate.toString();
      this.order.rate = parseFloat(tempData);
      this.setPriceInValue(this.order.rate);
      this.getCommission();
    } else {
      const tempData = this.lastSellBuyOrders.lastSellOrder.rate.toString();
      this.order.rate = parseFloat(tempData);
      this.setPriceInValue(this.order.rate);
      this.getCommission();
    }
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
    this.isTotalWithCommission = false;
    const quantityOf = this.userBalance * percent / 100;
    this.order.amount = quantityOf;
    this.setQuantityValue(quantityOf);

    this.getCommission();
  }

  /**
   * on input in field quantity
   * @param e
   */
  quantityInput(e): void {
    this.isTotalWithCommission = false;
    this.order.amount = parseFloat(this.deleteSpace(e.target.value.toString()));
    this.setQuantityValue(e.target.value);
    this.getCommission();
  }

  /**
   * For delete space
   * @param value
   * @returns {string}
   */
  deleteSpace(value): string {
    if (value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }

  /**
   * On input in field (price in)
   * @param e
   */
   rateInput(e): void {
    this.isTotalWithCommission = false;
       this.order.rate = parseFloat(this.deleteSpace(e.target.value.toString()));
       this.getCommission();
   }

  /**
   * On input in field stop
   * @param event
   */
  stopInput(event): void {
     this.orderStop = event.target.value;
  }

  /**
   * On input in field (Total in)
   * @param event
   */
   totalInput(event): void {
    this.isTotalWithCommission = false;
    this.order.total = parseFloat(this.deleteSpace(event.target.value.toString()));
    if (this.order.rate) {
      this.order.amount = this.order.total / this.order.rate;
      this.order.commission = this.order.total * (this.commissionIndex / 100);
      this.setQuantityValue(this.order.amount);
    }
   }

   calculateAmountByTotal(total): void {
     this.isTotalWithCommission = true;
     this.setTotalInValue(total);
     this.order.total = parseFloat(total);
     this.order.commission = this.order.total * (this.commissionIndex / 100.2);
     const x = this.mainTab === 'BUY' ? this.order.total - this.order.commission : this.order.total + this.order.commission;
     this.order.amount = x / this.order.rate;
     this.setQuantityValue(this.order.amount);
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
    value = typeof value === 'string' ? value : !value ? '0' : this.exponentToNumber(value).toString();
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
  orderFromOrderBook(order: OrderItem): void {
    this.dropdownLimitValue = this.limitsData[0];
    this.order.amount = 0;
    this.setQuantityValue(0);
    this.order.total = 0;
    this.setTotalInValue(0);
    this.order.rate = +order.exrate;
    this.setPriceInValue(this.order.rate);
    this.mainTab = order.orderType;
    this.order.commission = 0;
    }

  /**
   * Method transform exponent format to number
   * @param x
   * @returns {any}
   */
  exponentToNumber(x) {
    if (Math.abs(x) < 1.0) {
      let e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      let e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += (new Array(e + 1)).join('0');
      }
    }
    return x;
  }

  /**
   * on click submit button
   */
  onSubmit(): void {
    // window.open('https://exrates.me/dashboard', '_blank');
    if(!this.isAuthenticated()) {
      this.popupService.showMobileLoginPopup(true);
    }

    if (environment.production) {
      // todo while insecure
      this.popupService.demoPopupMessage = 0;
      this.popupService.showDemoTradingPopup(true);
    } else {
      if ( (this.stopForm.valid
        && this.orderStop
        && this.dropdownLimitValue === 'STOP_LIMIT')
        || (this.limitForm.valid
          && this.dropdownLimitValue === 'LIMIT'
          || this.dropdownLimitValue === 'ICO'
          || this.dropdownLimitValue === 'MARKET_PRICE')) {
        this.order.currencyPairId = this.currentPair.currencyPairId;
        this.order.baseType = this.dropdownLimitValue;
        this.order.orderType = this.mainTab;
        if (this.dropdownLimitValue === 'STOP_LIMIT') {
          this.order.stop = this.orderStop;
        }
        if (!this.isTotalWithCommission) {
          this.order.total = this.mainTab === 'BUY' ?
            this.order.total + this.order.commission :
            this.order.total - this.order.commission;
        }
        this.order.orderId === 0 ? this.createNewOrder() : this.updateOrder();
      }
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * on create new order
   */
  createNewOrder(): void {
    // this.resetOrderBookItem();
    this.tradingService.createOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.userService.getUserBalance(this.currentPair);
        this.order = {...this.defaultOrder}
        this.resetForms();
        this.store.dispatch(new SelectedOrderBookOrderAction(defaultOrderItem));
      this.notifySuccess = true;
      setTimeout(() => {this.notifySuccess = false; }, 5000);
    }, err => {
        console.log(err);
        this.notifyFail = true;
        setTimeout(() => {this.notifyFail = false; }, 5000);
      });
    this.orderStop = '';
    if (this.currencyPairInfo) {
      this.order.rate = this.currencyPairInfo.rate;
      this.setPriceInValue(this.currencyPairInfo.rate);
    }
  }

  /**
   * on update order from order-book
   */
  updateOrder(): void {
    this.resetOrderBookItem();
    this.tradingService.updateOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.userService.getUserBalance(this.currentPair);
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
      // let total;
      // this.mainTab === 'BUY' ?
      //   total = this.order.total + parseFloat(this.order.commission) :
      //   total = this.order.total - parseFloat(this.order.commission);
      // this.order.total = total;
      this.setTotalInValue(this.order.total);
    }
  }

  /**
   * Method run when refresh current currency pair
   * @param pair
   */
  private onGetCurrentCurrencyPair(pair): void {
    this.mainTab = 'BUY';
    this.currentPair = pair;
    this.order = {...this.defaultOrder};
    this.resetForms();
    this.splitPairName();
    this.getCommissionIndex();
  }
}
