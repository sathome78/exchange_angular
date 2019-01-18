import {Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {Order} from './order.model';
import {TradingService} from './trading.service';
import {DashboardService} from '../../dashboard.service';
import {OrderBookService} from '../order-book/order-book.service';
import {State, getCurrencyPair, getLastPrice, getSelectedOrderBookOrder, getDashboardState} from 'app/core/reducers/index';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {UserService} from 'app/shared/services/user.service';
import {OrderItem, UserBalance} from 'app/model';
import {PopupService} from 'app/shared/services/popup.service';
import {SelectedOrderBookOrderAction} from '../../actions/dashboard.actions';
import {defaultOrderItem} from '../../reducers/default-values';
import {AuthService} from 'app/shared/services/auth.service';
import {UtilsService} from 'app/shared/services/utils.service';
import {TranslateService} from '@ngx-translate/core';
import {LastPrice} from 'app/model/last-price.model';
import {BUY, SELL} from 'app/shared/constants';

@Component({
  selector: 'app-trading',
  templateUrl: 'trading.component.html',
  styleUrls: ['trading.component.scss']
})
export class TradingComponent extends AbstractDashboardItems implements OnInit, OnDestroy {


  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName: string;
  /** toggle for limits-dropdown */
  public isDropdownOpen = false;
  /** dropdown limit data */
  public limitsData = ['LIMIT', 'STOP_LIMIT']; // ['LIMIT', 'MARKET_PRICE', 'STOP_LIMIT', 'ICO'];
  /** selected limit */
  public dropdownLimitValue: string;
  public buyOrder: Order;
  public sellOrder: Order;
  private sellCommissionIndex = 0;
  private buyCommissionIndex = 0;
  public arrPairName = ['', ''];
  public sellForm: FormGroup;
  public buyForm: FormGroup;
  public sellStopValue: number;
  public buyStopValue: number;
  public userBalance: UserBalance;
  public currentPair;
  private commissionIndex = 0.002;
  public notifySuccess = false;
  public notifyFail = false;
  public message = '';
  public order;
  public lastSellOrder;
  public isTotalWithCommission = false;
  public SELL = SELL;
  public BUY = BUY;

  public defaultOrder: Order = {
    orderType: '',
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
    public tradingService: TradingService,
    private dashboardService: DashboardService,
    private popupService: PopupService,
    private orderBookService: OrderBookService,
    private userService: UserService,
    private authService: AuthService,
    private utils: UtilsService,
    public translateService: TranslateService
  ) {
    super();
  }


  ngOnInit() {
    this.itemName = 'trading';
    this.dropdownLimitValue = this.limitsData[0];
    this.initForms();
    this.resetSellModel();
    this.resetBuyModel();


    this.store
      .pipe(select(getDashboardState))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {
        this.userBalance = state.userBalance;
      });

    this.store
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (pair: CurrencyPair) => {
        this.onGetCurrentCurrencyPair(pair);
      });

    this.store
      .pipe(select(getLastPrice))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (lastPrice: LastPrice) => {
        this.setPriceInValue(lastPrice.price, this.BUY);
        this.setPriceInValue(lastPrice.price, this.SELL);
        this.sellOrder.rate = parseFloat(lastPrice.price.toString());
        this.buyOrder.rate = parseFloat(lastPrice.price.toString());
      });

    this.store
      .pipe(select(getSelectedOrderBookOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (order) => {
        this.orderFromOrderBook(order);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private resetBuyModel() {
    this.buyOrder = {...this.defaultOrder};
    this.buyOrder.orderType = this.BUY;
    this.buyForm.reset();
  }

  private resetSellModel() {
    this.sellOrder = {...this.defaultOrder};
    this.sellOrder.orderType = this.SELL;
    this.sellForm.reset();
  }

  /**
   * init forms
   */
  private initForms(): void {
    this.buyForm = new FormGroup({
      quantity: new FormControl('', Validators.required ),
      stop: new FormControl('', ),
      price: new FormControl('', Validators.required ),
      total: new FormControl('', Validators.required ),
    });
    this.sellForm = new FormGroup({
      quantity: new FormControl('', Validators.required ),
      stop: new FormControl('', ),
      price: new FormControl('', Validators.required ),
      total: new FormControl('', Validators.required ),
    });
  }

  /**
   * Get readable limit string
   * @param {string} value
   * @returns {string}
   */
  showLimit(value: string): string {
    switch (value) {
      case 'LIMIT': {
        return this.translateService.instant('Limit order');
      }
      case 'MARKET_PRICE': {
        return this.translateService.instant('Market price');
      }
      case 'STOP_LIMIT': {
        return this.translateService.instant('Stop limit');
      }
      case 'ICO': {
        return this.translateService.instant('ICO order');
      }
    }
  }

  /**
   * On select limit
   * @param {string} limit
   */
  selectedLimit(limit: string): void {
    this.dropdownLimitValue = limit;
    this.isDropdownOpen = false;
    this.resetBuyModel();
    this.resetSellModel();
    this.resetStopValue();
  }

  private resetStopValue(): void {
    this.buyStopValue = 0;
    this.sellStopValue = 0;
  }

  /**
   * set form value (quantityOf)
   * @param value
   */
  setQuantityValue(value, orderType: string): void {
    value = typeof value === 'string' ? value : this.exponentToNumber(value).toString();
    orderType === this.BUY ?
    this.buyForm.controls['quantity'].setValue(value) :
    this.sellForm.controls['quantity'].setValue(value);
  }

  /**
   * set form value (priceIn/limit)
   * @param value
   */
  setPriceInValue(value, orderType: string): void {
    value = typeof value === 'string' ? value : !value ? '0' : this.exponentToNumber(value).toString();
    orderType === this.BUY ?
      this.buyForm.controls['price'].setValue(value) :
      this.sellForm.controls['price'].setValue(value);
  }

  /**
   * set form value (totalIn)
   * @param value
   */
  setTotalInValue(value, orderType: string): void {
    value = typeof value === 'string' ? value : this.exponentToNumber(value).toString();
    orderType === this.BUY ?
      this.buyForm.controls['total'].setValue(value) :
      this.sellForm.controls['total'].setValue(value);
  }

  /**
   * set form value (stop)
   * @param value
   */
  setStopValue(value, orderType: string): void {
    orderType === this.BUY ?
      this.buyForm.controls['stop'].setValue(value) :
      this.sellForm.controls['stop'].setValue(value);
  }

  /**
   * on select checkbox of percents
   * @param {number} percent
   */
  selectedPercent(percent: number, orderType: string): void {
    let total = 0;
    this.isTotalWithCommission = false;

    if (orderType === this.BUY) {
      total = this.userBalance.cur2 ? +this.userBalance.cur2.balance : 0;
      const totalIn = total * percent / 100;
      this.buyOrder.total = totalIn;
      this.setTotalInValue(totalIn, this.BUY);
      this.getCommission(orderType, false);
    } else {
      total = this.userBalance.cur1 ? +this.userBalance.cur1.balance : 0;
      const quantityOf = total * percent / 100;
      this.sellOrder.amount = quantityOf;
      this.setQuantityValue(quantityOf, this.SELL);
      this.getCommission(orderType);
    }
  }

  /**
   * fill model according to order-book order
   * @param order
   */
  orderFromOrderBook(order: OrderItem): void {
    const rate = parseFloat(order.exrate.toString());
    if (order.orderType === this.SELL) {
      this.sellOrder.rate = rate;
      this.setPriceInValue(rate, this.SELL);
    } else {
      this.buyOrder.rate = rate;
      this.setPriceInValue(rate, this.BUY);
    }
    this.getCommission(order.orderType);
  }

  /**
   * get commission index (send request)
   */
  getCommissionIndex(type: string, currencyPairId: number): void {
    if (type && currencyPairId) {
      const subscription = this.tradingService.getCommission(type, currencyPairId).subscribe(res => {
        type === this.BUY ?
        this.buyCommissionIndex = res.commissionValue :
        this.sellCommissionIndex = res.commissionValue;
        this.commissionIndex = res.commissionValue;
        subscription.unsubscribe();
      });
    }
  }

  /**
   * Method run when refresh current currency pair
   * @param pair
   */
  private onGetCurrentCurrencyPair(pair): void {
    this.currentPair = pair;
    this.resetSellModel();
    this.resetBuyModel();
    this.splitPairName();
    this.getCommissionIndex(this.BUY, this.currentPair.currencyPairId);
    this.getCommissionIndex(this.SELL, this.currentPair.currencyPairId);
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
   * split pair name for showing
   */
  private splitPairName() {
    if (this.currentPair.currencyPairName) {
      this.arrPairName = this.currentPair.currencyPairName.split('/');
    }
  }

  calculateAmountByTotalWithCommission(type: string): void {
    let total = 0;
    if (type === this.BUY) {
      total = this.userBalance.cur2 ? +this.userBalance.cur2.balance : 0;

      this.isTotalWithCommission = true;
      this.setTotalInValue(total, this.BUY);
      this.buyOrder.total = total;
      if (this.buyOrder.rate) {
        this.buyOrder.commission = this.buyOrder.total * (this.buyCommissionIndex / 100);
        const x = this.buyOrder.total - this.buyOrder.commission;
        this.buyOrder.amount = x / this.buyOrder.rate;
        this.setQuantityValue(this.buyOrder.amount, this.BUY);
      } else {
        this.buyOrder.commission = 0;
        this.buyOrder.amount = 0;
        this.setQuantityValue(0, this.BUY);
      }
    } else {
      total = this.userBalance.cur1 ? +this.userBalance.cur1.balance : 0;
      this.setQuantityValue(total, this.SELL);
      this.sellOrder.amount = total;
      this.getCommission(type);
    }
  }

  /**
   * calculate commission
   */
  private getCommission(type: string, setTotal = true): void {
    type === this.BUY ?
      this.getCommissionNested(this.buyOrder, type, setTotal) :
      this.getCommissionNested(this.sellOrder, type, setTotal);
  }

  private getCommissionNested(order: Order, type: string, setTotal: boolean) {
    if (setTotal) {
      if (order.rate && order.rate >= 0) {
        order.total = order.amount * order.rate;
        order.commission = (order.rate * order.amount) * ((type === this.BUY ? this.buyCommissionIndex : this.sellCommissionIndex) / 100);
        this.setTotalInValue(order.total, type);
      }
    } else {
      if (order.rate && order.rate >= 0) {
        order.amount = order.total / order.rate;
        order.commission = (order.rate * order.amount) * ((type === this.BUY ? this.buyCommissionIndex : this.sellCommissionIndex) / 100);
        this.setQuantityValue(order.amount, type);
      }
    }
  }

  /**
   * on input in field quantity
   * @param e
   */
  quantityInput(e, type: string): void {
    this.isTotalWithCommission = false;
    if (type === this.BUY) {
      this.buyOrder.amount = parseFloat(this.deleteSpace(e.target.value.toString()));
      this.setQuantityValue(e.target.value, type);
    } else {
      this.sellOrder.amount = parseFloat(this.deleteSpace(e.target.value.toString()));
      this.setQuantityValue(e.target.value, type);
    }
    this.getCommission(type);
  }


  /**
   * On input in field (price in)
   * @param e
   */
  rateInput(e, type: string): void {
    this.isTotalWithCommission = false;
    if (type === this.BUY) {
      this.buyOrder.rate = parseFloat(this.deleteSpace(e.target.value.toString()));
      this.setPriceInValue(e.target.value, type);
    } else {
      this.sellOrder.rate = parseFloat(this.deleteSpace(e.target.value.toString()));
      this.setPriceInValue(e.target.value, type);
    }
    this.getCommission(type);
  }

  /**
   * On input in field stop
   * @param event
   */
  stopInput(event, type: string): void {

    if (type === this.BUY) {
      this.buyStopValue = event.target.value;
      this.setStopValue(event.target.value, type);
    } else {
      this.sellStopValue = event.target.value;
      this.setStopValue(event.target.value, type);
    }
  }

  /**
   * On input in field (Total in)
   * @param event
   */
  totalInput(event, type: string): void {
    this.isTotalWithCommission = false;
    type === this.BUY ?
      this.inputTotalNested(event, type, this.buyOrder) :
      this.inputTotalNested(event, type, this.sellOrder);
  }

  private inputTotalNested(event, type: string, order: Order) {
    order.total = parseFloat(this.deleteSpace(event.target.value));
    if (order.rate) {
      order.amount = order.total / order.rate;
      order.commission = order.total * ((type === this.BUY ? this.buyCommissionIndex : this.sellCommissionIndex) / 100);
      this.setQuantityValue(order.amount, type);
    }
  }

  /**
   * Method transform exponent format to number
   * @param x
   * @returns {any}
   */
  private exponentToNumber(x) {
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
  onSubmit(type: string): void {
    // window.open('https://exrates.me/dashboard', '_blank');
    if (!this.isAuthenticated()) {
      this.popupService.showMobileLoginPopup(true);
      return;
    }
    type === this.BUY ?
      this.onBuySubmit(type) :
      this.onSellSubmit(type);
  }

  private onSellSubmit(type: string) {
    if (this.sellForm.valid) {
      this.sellOrder.currencyPairId = this.currentPair.currencyPairId;
      this.sellOrder.baseType = this.dropdownLimitValue;
      this.sellOrder.orderType = this.SELL;

      this.dropdownLimitValue === 'STOP_LIMIT' ?
        this.sellOrder.stop = parseFloat(this.sellStopValue.toString()) :
        delete this.sellOrder.stop;

      this.sellOrder.total = !this.isTotalWithCommission ?
        this.sellOrder.total - this.sellOrder.commission :
        this.sellOrder.total;

      this.createNewOrder(type);
    }
  }

  private onBuySubmit(type: string) {
    if (this.buyForm.valid) {
      this.buyOrder.currencyPairId = this.currentPair.currencyPairId;
      this.buyOrder.baseType = this.dropdownLimitValue;
      this.buyOrder.orderType = this.BUY;

      this.dropdownLimitValue === 'STOP_LIMIT' ?
        this.buyOrder.stop = parseFloat(this.buyStopValue.toString()) :
        delete this.buyOrder.stop;

      this.buyOrder.total = !this.isTotalWithCommission ?
        this.buyOrder.total + this.buyOrder.commission :
        this.buyOrder.total;

      this.createNewOrder(type);
    }
  }

  /**
   * on create new order
   */
  private createNewOrder(type: string): void {
    type === 'BUY' ?
      console.log(this.buyOrder) :
      console.log(this.sellOrder);

    const order = type === this.BUY ? this.buyOrder : this.sellOrder;
    this.tradingService.createOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.userService.getUserBalance(this.currentPair);
        type === this.BUY ? this.resetBuyModel() : this.resetSellModel();

        this.store.dispatch(new SelectedOrderBookOrderAction(defaultOrderItem));
        this.notifySuccess = true;
        setTimeout(() => {this.notifySuccess = false; }, 5000);
      }, err => {
        console.log(err);
        this.notifyFail = true;
        setTimeout(() => {this.notifyFail = false; }, 5000);
      });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public isFiat(currName: string): boolean {
    return this.utils.isFiat(currName);
  }
}
