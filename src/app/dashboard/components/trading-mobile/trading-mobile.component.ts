import { Component, OnDestroy, OnInit, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { takeUntil, withLatestFrom } from 'rxjs/internal/operators';
import { select, Store } from '@ngrx/store';

import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { Order } from '../../../model/order.model';
import { TradingService } from '../../services/trading.service';
import {
  State,
  getActiveCurrencyPair,
  getLastPrice,
  getSelectedOrderBookOrder,
  getDashboardState,
  getIsAuthenticated,
  getOrdersBookSellOrders,
  getOrdersBookBuyOrders
} from 'app/core/reducers/index';
import { UserService } from 'app/shared/services/user.service';
import { OrderItemOB, UserBalance } from 'app/model';
import { PopupService } from 'app/shared/services/popup.service';
import { LoadOpenOrdersAction } from '../../actions/dashboard.actions';
import { TranslateService } from '@ngx-translate/core';
import { LastPrice } from 'app/model/last-price.model';
import { BUY, orderBaseType, SELL } from 'app/shared/constants';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { messages } from '../../constants';
import { UtilsService } from 'app/shared/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trading-mobile',
  templateUrl: 'trading-mobile.component.html',
  styleUrls: ['trading-mobile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingMobileComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName = 'trading';
  /** toggle for limits-dropdown */
  public isDropdownOpen = false;
  /** dropdown limit data */
  public baseType = orderBaseType;
  public limitsData = [this.baseType.LIMIT, this.baseType.MARKET, this.baseType.STOP_LIMIT];
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
  public currentPair: SimpleCurrencyPair;

  public maxBuyMarketOrder = 0;
  public maxSellMarketOrder = 0;
  public ordersBookSellOrders: OrderItemOB[] = [];
  public ordersBookBuyOrders: OrderItemOB[] = [];
  public notifySuccess = false;
  public notifyFail = false;
  public notifyFailRestricted = false;
  public notifyFailRestrictedBody = '';
  public notifyFailShowKycBtn = false;
  public message = '';
  public errorMessages = [];
  public order;
  public isTotalWithCommission = false;
  public isPossibleSetPrice = true;
  public SELL = SELL;
  public BUY = BUY;
  public createdOrder: Order;
  public loading = false;
  public isAuthenticated = false;
  private successTimeout;
  private failTimeout;

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

  private defaultFormValues = {
    quantity: '0',
    stop: '0',
    price: '0',
    total: '0',
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'dropdown__btn') {
      this.isDropdownOpen = false;
    }
  }

  constructor(
    private store: Store<State>,
    public tradingService: TradingService,
    private popupService: PopupService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService,
    private router: Router,
    public translateService: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.dropdownLimitValue = this.limitsData[0];
    this.initForms();
    this.resetSellModel();
    this.resetBuyModel();

    this.store
      .pipe(select(getIsAuthenticated))
      .pipe(withLatestFrom(this.store.pipe(select(getActiveCurrencyPair))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([isAuth, pair]: [boolean, SimpleCurrencyPair]) => {
        this.isAuthenticated = isAuth;
        this.onGetCurrentCurrencyPair(pair, isAuth); // get commission when you login
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getDashboardState))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {
        this.userBalance = state.userBalance;
        this.maxSellMarketOrder = this.calcMaxSellMarketOrder(this.ordersBookBuyOrders);
        this.maxBuyMarketOrder = this.calcMaxBuyMarketOrder(this.ordersBookSellOrders);
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(withLatestFrom(this.store.pipe(select(getIsAuthenticated))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([pair, isAuth]: [SimpleCurrencyPair, boolean]) => {
        this.onGetCurrentCurrencyPair(pair, isAuth); // get commission when you change currency pair
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getLastPrice))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((lastPrice: LastPrice) => {
        if (this.isPossibleSetPrice) {
          const rate = parseFloat(lastPrice.price.toString());
          this.setNewLimitAndStop(rate);
        }
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getSelectedOrderBookOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(order => {
        if (order.exrate !== '0') {
          this.isPossibleSetPrice = false;
          this.orderFromOrderBook(order);
        }
        this.cdr.detectChanges();
      });
    this.store
      .pipe(select(getOrdersBookSellOrders))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(orders => {
        this.ordersBookSellOrders = orders;
        if (this.dropdownLimitValue === this.baseType.MARKET) {
          this.maxBuyMarketOrder = this.calcMaxBuyMarketOrder(this.ordersBookSellOrders);
        }
      });

    this.store
      .pipe(select(getOrdersBookBuyOrders))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(orders => {
        this.ordersBookBuyOrders = orders.slice().reverse();
        if (this.dropdownLimitValue === this.baseType.MARKET) {
          this.maxSellMarketOrder = this.calcMaxSellMarketOrder(this.ordersBookBuyOrders);
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private resetBuyModel(price: number = null, stopPrice: number = null) {
    this.buyOrder = { ...this.defaultOrder };
    this.buyOrder.orderType = this.BUY;
    this.buyForm.reset(this.defaultFormValues);
    if (!!price) {
      this.buyOrder.rate = price;
      this.setPriceInValue(price, this.BUY);
    }
    if (!!stopPrice && this.dropdownLimitValue === orderBaseType.STOP_LIMIT) {
      this.buyStopValue = stopPrice;
      this.setStopValue(stopPrice, this.BUY);
    }
  }

  private resetSellModel(price: number = null, stopPrice: number = null) {
    this.sellOrder = { ...this.defaultOrder };
    this.sellOrder.orderType = this.SELL;
    this.sellForm.reset(this.defaultFormValues);
    if (!!price) {
      this.sellOrder.rate = price;
      this.setPriceInValue(price, this.SELL);
    }
    if (!!stopPrice && this.dropdownLimitValue === orderBaseType.STOP_LIMIT) {
      this.sellStopValue = stopPrice;
      this.setStopValue(stopPrice, this.SELL);
    }
  }

  /**
   * init forms
   */
  private initForms(): void {
    this.buyForm = new FormGroup({
      quantity: new FormControl('', Validators.required),
      stop: new FormControl(''),
      price: new FormControl('', Validators.required),
      total: new FormControl('', Validators.required),
    });
    this.sellForm = new FormGroup({
      quantity: new FormControl('', Validators.required),
      stop: new FormControl(''),
      price: new FormControl('', Validators.required),
      total: new FormControl('', Validators.required),
    });
  }

  /**
   * Get readable limit string
   * @param {string} value
   * @returns {string}
   */
  showLimit(value: string, popup: boolean = false): string {
    switch (value) {
      case this.baseType.LIMIT: {
        return popup ? this.translateService.instant('Limit') : this.translateService.instant('Limit order');
      }
      case this.baseType.MARKET: {
        return this.translateService.instant('Market');
      }
      case this.baseType.STOP_LIMIT: {
        return popup ? this.translateService.instant('Stop limit') : this.translateService.instant('Stop limit');
      }
      case this.baseType.ICO: {
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
    this.resetForms();
    if (limit === this.baseType.MARKET) {
      this.maxBuyMarketOrder = this.calcMaxBuyMarketOrder(this.ordersBookSellOrders);
      this.maxSellMarketOrder = this.calcMaxSellMarketOrder(this.ordersBookBuyOrders);
    }
    this.isDropdownOpen = false;
  }

  private resetForms(): void {
    this.resetBuyModel();
    this.resetSellModel();
  }

  /**
   * set form value (quantityOf)
   * @param value
   */
  setQuantityValue(value, orderType: string): void {
    const newValue = typeof value === 'string' ? value : !value ? '0' : this.utilsService.currencyFormat(value);
    orderType === this.BUY
      ? this.buyForm.controls['quantity'].setValue(newValue)
      : this.sellForm.controls['quantity'].setValue(newValue);
  }

  /**
   * set form value (priceIn/limit)
   * @param value
   */
  setPriceInValue(value, orderType: string): void {
    const newValue = typeof value === 'string' ? value : !value ? '0' : this.utilsService.currencyFormat(value);
    orderType === this.BUY
      ? this.buyForm.controls['price'].setValue(newValue)
      : this.sellForm.controls['price'].setValue(newValue);
  }

  /**
   * set form value (totalIn)
   * @param value
   */
  setTotalInValue(value, orderType: string): void {
    const newValue = typeof value === 'string' ? value : !value ? '0' : this.utilsService.currencyFormat(value);
    orderType === this.BUY
      ? this.buyForm.controls['total'].setValue(newValue)
      : this.sellForm.controls['total'].setValue(newValue);
  }

  /**
   * set form value (stop)
   * @param value
   */
  setStopValue(value, orderType: string): void {
    const newValue = typeof value === 'string' ? value : !value ? '0' : this.utilsService.currencyFormat(value);
    orderType === this.BUY
      ? this.buyForm.controls['stop'].setValue(newValue)
      : this.sellForm.controls['stop'].setValue(newValue);
  }

  /**
   * on select checkbox of percents
   * @param {number} percent
   */
  selectedPercent(percent: number, orderType: string): void {
    let total = 0;
    this.isTotalWithCommission = false;

    if (orderType === this.BUY && this.dropdownLimitValue === this.baseType.MARKET) {
      total = this.userBalance.cur2 ? +this.userBalance.cur2.balance : 0;
      const totalIn = (total * percent) / 100;
      const quantityOf = this.calcBuyMarketOrder(this.ordersBookSellOrders, totalIn);
      this.setQuantityValue(quantityOf, this.BUY);
      this.buyOrder.amount = quantityOf;
    } else if (orderType === this.BUY) {
      total = this.userBalance.cur2 ? +this.userBalance.cur2.balance : 0;
      const totalIn = (total * percent) / 100;
      this.buyOrder.total = totalIn;
      this.setTotalInValue(totalIn, this.BUY);
      this.getCommission(orderType, false);
    } else if (orderType === this.SELL && this.dropdownLimitValue === this.baseType.MARKET) {
      total = this.userBalance.cur1 ? +this.userBalance.cur1.balance : 0;
      const totalIn = (total * percent) / 100;
      const quantityOf = this.calcSellMarketOrder(this.ordersBookBuyOrders, totalIn);
      this.sellOrder.amount = quantityOf;
      this.setQuantityValue(quantityOf, this.SELL);
    } else {
      total = this.userBalance.cur1 ? +this.userBalance.cur1.balance : 0;
      const quantityOf = (total * percent) / 100;
      this.sellOrder.amount = quantityOf;
      this.setQuantityValue(quantityOf, this.SELL);
      this.getCommission(orderType);
    }
  }

  /**
   * fill model according to order-book order
   * @param order
   */
  orderFromOrderBook(order: OrderItemOB): void {
    this.resetBuyModel();
    this.resetSellModel();
    this.maxBuyMarketOrder = 0;
    this.maxSellMarketOrder = 0;
    const rate = parseFloat(order.exrate.toString());
    this.setNewLimitAndStop(rate);
    if (this.dropdownLimitValue !== this.baseType.MARKET) {
      const amount = this.getQuantityOfSelectedOrder(order);
      this.setQuantityValue(amount, order.orderType === this.SELL ? this.BUY : this.SELL);
      this.quantityInput({ target: { value: amount } }, order.orderType === this.SELL ? this.BUY : this.SELL);
    }
    this.getCommission(this.SELL);
    this.getCommission(this.BUY);
  }

  private setNewLimitAndStop(rate) {
    if (this.dropdownLimitValue === this.baseType.STOP_LIMIT) {
      this.sellOrder.stop = rate;
      this.sellStopValue = rate;
      this.setStopValue(rate, this.BUY);
      this.buyOrder.stop = rate;
      this.buyStopValue = rate;
      this.setStopValue(rate, this.SELL);
    }
    this.sellOrder.rate = rate;
    this.setPriceInValue(rate, this.BUY);
    this.buyOrder.rate = rate;
    this.setPriceInValue(rate, this.SELL);
  }

  /**
   * get commission index (send request)
   */
  getCommissionIndex(type: string, currencyPairId: number): void {
    if (type && currencyPairId) {
      this.tradingService
        .getCommission(type, currencyPairId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          type === this.BUY
            ? (this.buyCommissionIndex = res.commissionValue)
            : (this.sellCommissionIndex = res.commissionValue);
          this.cdr.detectChanges();
        });
    }
  }

  /**
   * Method run when refresh current currency pair
   * @param pair
   */
  private onGetCurrentCurrencyPair(pair: SimpleCurrencyPair, isAuth: boolean): void {
    this.isPossibleSetPrice = true;
    this.currentPair = pair;
    this.userService.getUserBalance(this.currentPair);
    this.resetSellModel();
    this.resetBuyModel();
    this.splitPairName();
    if (isAuth) {
      this.getCommissionIndex(this.BUY, this.currentPair.id);
      this.getCommissionIndex(this.SELL, this.currentPair.id);
    }
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
    if (this.currentPair.name) {
      this.arrPairName = this.currentPair.name.split('/');
    }
  }

  calculateAmountByTotalWithCommission(type: string): void {
    let total = 0;
    if (type === this.BUY && this.dropdownLimitValue === this.baseType.MARKET) {
      this.setQuantityValue(this.maxBuyMarketOrder, this.BUY);
      this.buyOrder.amount = this.maxBuyMarketOrder;
    } else if (type === this.BUY) {
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
    } else if (type === this.SELL && this.dropdownLimitValue === this.baseType.MARKET) {
      this.setQuantityValue(this.maxSellMarketOrder, this.SELL);
      this.sellOrder.amount = this.maxSellMarketOrder;
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
    type === this.BUY
      ? this.getCommissionNested(this.buyOrder, type, setTotal)
      : this.getCommissionNested(this.sellOrder, type, setTotal);
  }

  private getCommissionNested(order: Order, type: string, setTotal: boolean) {
    if (setTotal) {
      if (order.rate && order.rate >= 0) {
        order.total = (order.amount * order.rate * 100) / 100;
        order.commission =
          order.rate * order.amount * ((type === this.BUY ? this.buyCommissionIndex : this.sellCommissionIndex) / 100);
        this.setTotalInValue(order.total, type);
      } else {
        order.commission = 0;
        this.setTotalInValue(0, type);
      }
    } else {
      if (order.rate && order.rate >= 0) {
        order.amount = order.total / order.rate;
        order.commission =
          order.rate * order.amount * ((type === this.BUY ? this.buyCommissionIndex : this.sellCommissionIndex) / 100);
        this.setQuantityValue(order.amount, type);
      } else {
        order.commission = 0;
        this.setTotalInValue(0, type);
      }
    }
  }

  /**
   * on input in field quantity
   * @param e
   */
  quantityInput(e, type: string): void {
    this.isTotalWithCommission = false;
    this.isPossibleSetPrice = false;
    const value = e.target.value === '' ? 0 : e.target.value;
    if (type === this.BUY) {
      this.buyOrder.amount = parseFloat(this.deleteSpace(value.toString()));
      this.setQuantityValue(value, type);
    } else {
      this.sellOrder.amount = parseFloat(this.deleteSpace(value.toString()));
      this.setQuantityValue(value, type);
    }
    this.getCommission(type);
  }

  /**
   * On input in field (price in)
   * @param e
   */
  rateInput(e, type: string): void {
    this.isPossibleSetPrice = false;
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
    this.isPossibleSetPrice = false;
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
    this.isPossibleSetPrice = false;
    this.isTotalWithCommission = false;
    type === this.BUY
      ? this.inputTotalNested(event, type, this.buyOrder)
      : this.inputTotalNested(event, type, this.sellOrder);
  }

  private inputTotalNested(event, type: string, order: Order) {
    const value = event.target.value === '' ? '0' : event.target.value;
    this.setTotalInValue(value, type);
    order.total = parseFloat(this.deleteSpace(value));
    if (order.rate) {
      order.amount = order.total / order.rate;
      order.commission =
        value > 0 ? order.total * ((type === this.BUY ? this.buyCommissionIndex : this.sellCommissionIndex) / 100) : 0;
      this.setQuantityValue(order.amount, type);
    }
  }

  /**
   * on click submit button
   */
  onSubmit(type: string): void {
    // const newWnd = window.open('https://exrates.me/dashboard', '_blank');
    // newWnd.opener = null;
    if (!this.isAuthenticated) {
      this.popupService.showMobileLoginPopup(true);
      return;
    }
    type === this.BUY ? this.onBuySubmit(type) : this.onSellSubmit(type);
  }

  private onSellSubmit(type: string) {
    if (this.dropdownLimitValue === this.baseType.MARKET) {
      this.sellForm.controls['quantity'].setValidators([
        Validators.required,
        this.marketOrderValidation(this.maxSellMarketOrder),
      ]);
      this.sellForm.controls['quantity'].updateValueAndValidity();
    }
    if (this.sellForm.valid) {
      this.sellOrder.currencyPairId = this.currentPair.id;
      this.sellOrder.baseType = this.dropdownLimitValue;
      this.sellOrder.orderType = this.SELL;

      if (this.dropdownLimitValue === this.baseType.MARKET) {
        this.sellOrder.total = 0;
        this.sellOrder.commission = 0;
        this.sellOrder.rate = 0;
        this.createMarketOrder(type);
        this.sellForm.controls.quantity.setValidators([Validators.required]);
        return;
      }

      this.dropdownLimitValue === this.baseType.STOP_LIMIT
        ? (this.sellOrder.stop = parseFloat(this.sellStopValue ? this.sellStopValue.toString() : '0'))
        : delete this.sellOrder.stop;

      this.sellOrder.total = !this.isTotalWithCommission
        ? this.sellOrder.total - this.sellOrder.commission
        : this.sellOrder.total;

      this.createNewOrder(type);
    }
    this.sellForm.controls.quantity.setValidators([Validators.required]);
  }

  private onBuySubmit(type: string) {
    if (this.dropdownLimitValue === this.baseType.MARKET) {
      this.buyForm.controls['quantity'].setValidators([
        Validators.required,
        this.marketOrderValidation(this.maxBuyMarketOrder),
      ]);
      this.buyForm.controls['quantity'].updateValueAndValidity();
    }
    if (this.buyForm.valid) {
      this.buyOrder.currencyPairId = this.currentPair.id;
      this.buyOrder.baseType = this.dropdownLimitValue;
      this.buyOrder.orderType = this.BUY;

      if (this.dropdownLimitValue === this.baseType.MARKET) {
        this.buyOrder.total = 0;
        this.buyOrder.commission = 0;
        this.buyOrder.rate = 0;
        this.createMarketOrder(type);
        this.buyForm.controls.quantity.setValidators([Validators.required]);
        return;
      }

      this.dropdownLimitValue === this.baseType.STOP_LIMIT
        ? (this.buyOrder.stop = parseFloat(this.buyStopValue ? this.buyStopValue.toString() : '0'))
        : delete this.buyOrder.stop;

      this.buyOrder.total = !this.isTotalWithCommission
        ? this.buyOrder.total + this.buyOrder.commission
        : this.buyOrder.total;

      this.createNewOrder(type);
    }
    this.buyForm.controls.quantity.setValidators([Validators.required]);
  }

  private createMarketOrder(type) {
    clearTimeout(this.failTimeout);
    clearTimeout(this.successTimeout);
    this.notifySuccess = false;
    this.notifyFail = false;

    const order = type === this.BUY ? this.buyOrder : this.sellOrder;
    this.createdOrder = order;
    this.loading = true;
    const isDataValid = this.checkIsDataForOrderValid(order);

    if (isDataValid) {
      this.tradingService
        .createOrder(order)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            type === this.BUY
              ? this.resetBuyModel(order.rate, this.dropdownLimitValue === orderBaseType.STOP_LIMIT ? order.stop : null)
              : this.resetSellModel(
                  order.rate,
                  this.dropdownLimitValue === orderBaseType.STOP_LIMIT ? order.stop : null
                );
            this.createOrderSuccess();
          },
          err => {
            this.checkErrorCode(err);
            this.createOrderFail();
          }
        );
    } else {
      this.checkValidationCode(order);
      this.createOrderFail();
    }
  }

  /**
   * on create new order
   */
  private createNewOrder(type: string): void {
    clearTimeout(this.failTimeout);
    clearTimeout(this.successTimeout);
    this.notifySuccess = false;
    this.notifyFail = false;

    const order = type === this.BUY ? this.buyOrder : this.sellOrder;
    this.createdOrder = order;

    const isDataValid = this.checkIsDataForOrderValid(order);
    if (isDataValid) {
      this.loading = true;
      this.tradingService
        .createOrder(order)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            type === this.BUY
              ? this.resetBuyModel(order.rate, this.dropdownLimitValue === orderBaseType.STOP_LIMIT ? order.stop : null)
              : this.resetSellModel(
                  order.rate,
                  this.dropdownLimitValue === orderBaseType.STOP_LIMIT ? order.stop : null
                );
            this.createOrderSuccess();
          },
          err => {
            this.checkErrorCode(err);
            this.createOrderFail();
          }
        );
    } else {
      this.checkValidationCode(order);
      this.createOrderFail();
    }
  }

  private createOrderSuccess() {
    this.isPossibleSetPrice = true;
    this.store.dispatch(new LoadOpenOrdersAction(this.currentPair.id));
    this.userService.getUserBalance(this.currentPair);
    this.notifySuccess = true;
    this.loading = false;
    this.cdr.detectChanges();
    this.successTimeout = setTimeout(() => {
      this.notifySuccess = false;
      this.createdOrder = null;
      this.cdr.detectChanges();
    }, 5000);
  }

  private createOrderFail() {
    if (this.notifyFailRestricted) {
      return;
    }
    this.notifyFail = true;
    this.loading = false;
    this.cdr.detectChanges();
    this.failTimeout = setTimeout(() => {
      this.notifyFail = false;
      this.createdOrder = null;
      this.cdr.detectChanges();
    }, 5000);
  }

  private createOrderRestrictedFail() {
    this.notifyFailRestricted = true;
    this.notifyFailRestrictedBody =
      this.translateService.instant('Sorry, you are not allowed to trade this pair!');
    this.notifyFailShowKycBtn = false;
    this.loading = false;
    this.cdr.detectChanges();
  }
  private createOrderNeedKycFail() {
    this.notifyFailRestricted = true;
    this.notifyFailRestrictedBody =
      this.translateService.instant('Sorry, you must pass verification to trade this pair!');
    this.notifyFailShowKycBtn = true;
    this.loading = false;
    this.cdr.detectChanges();
  }

  closeNotifyFailRestricted() {
    this.notifyFailRestricted = false;
    this.notifyFailRestrictedBody = '';
    this.notifyFailShowKycBtn = false;
  }

  private checkErrorCode(err) {
    this.errorMessages = [];
    if (err.status === 406) {
      if (err.error.cause === 'NgOrderValidationException') {
        const errors = err.error.validationResults.errors;
        const errorParams = err.error.validationResults.errorParams;
        this.defineMessage(errors, errorParams);
      }
    } else if (err.status === 451) {
      if (err.error.errorCode === 'ORDER_CREATION_RESTRICTED') {
        this.createOrderRestrictedFail();
      } else if (err.error.errorCode === 'NEED_VERIFICATION_EXCEPTION') {
        this.createOrderNeedKycFail();
      }
    } else if (err.error.cause === 'OpenApiException') {
      this.errorMessages.push(err.error.detail);
    }
  }

  private checkIsDataForOrderValid(order) {
    let isValid = false;
    if (this.dropdownLimitValue === this.baseType.MARKET) {
      isValid = order.amount > 0.00000001;
    } else if (this.dropdownLimitValue === this.baseType.STOP_LIMIT) {
      isValid =
        order.total > 0.00000001 && order.stop > 0.00000001 && order.amount > 0.00000001 && order.rate > 0.00000001;
    } else if (this.dropdownLimitValue === this.baseType.LIMIT) {
      isValid = order.total > 0.00000001 && order.amount > 0.00000001 && order.rate > 0.00000001;
    }
    return isValid;
  }

  private checkValidationCode(order) {
    this.errorMessages = [];
    if (this.dropdownLimitValue === this.baseType.MARKET) {
      if (order.amount <= 0.00000001) {
        this.errorMessages.push('The quantity must be greater than 0.00000001.');
      }
    } else if (this.dropdownLimitValue === this.baseType.STOP_LIMIT) {
      if (order.amount <= 0.00000001) {
        this.errorMessages.push('The quantity must be greater than 0.00000001.');
      }
      if (order.rate <= 0.00000001) {
        this.errorMessages.push('The limit price must be greater than 0.00000001.');
      }
      if (order.stop <= 0.00000001) {
        this.errorMessages.push('The stop limit must be greater than 0.00000001.');
      }
      if (order.total <= 0.00000001) {
        this.errorMessages.push('The total must be greater than 0.00000001.');
      }
    } else if (this.dropdownLimitValue === this.baseType.LIMIT) {
      if (order.amount <= 0.00000001) {
        this.errorMessages.push('The quantity must be greater than 0.00000001.');
      }
      if (order.rate <= 0.00000001) {
        this.errorMessages.push('The limit price must be greater than 0.00000001.');
      }
      if (order.total <= 0.00000001) {
        this.errorMessages.push('The total must be greater than 0.00000001.');
      }
    }
    if (this.errorMessages.length) {
      if (this.errorMessages.length === 1) {
        this.errorMessages.push('Complete the field');
      } else {
        this.errorMessages.push('Complete the fields');
      }
    }
  }

  defineMessage(errors, errorParams) {
    Object.keys(errors).forEach(key => {
      const path = errors[key].split('.');
      let message = messages[path[0]][path[1]];
      if (errorParams[key] && errorParams[key]) {
        message = message.replace('{0}', errorParams[key][0]);
        message = message.replace('{1}', errorParams[key][1]);
      }
      this.errorMessages.push(message);
    });
  }

  getQuantityOfSelectedOrder(selectedOrder: OrderItemOB) {
    let bal;

    if (selectedOrder.orderType === this.BUY) {
      bal = (this.userBalance && this.userBalance.cur1 && this.userBalance.cur1.balance) || 0;
      if (+selectedOrder.sumAmount < bal) {
        return selectedOrder.sumAmount;
      }
    } else {
      bal = (this.userBalance && this.userBalance.cur2 && this.userBalance.cur2.balance) || 0;
      if (+selectedOrder.total < bal) {
        return selectedOrder.sumAmount;
      }
    }

    return bal / +selectedOrder.exrate;
  }

  calcBuyMarketOrder(orders, balance = 0) {
    if (!orders.length) {
      return 0;
    }

    const lastItem = orders.find(el => +el.total >= +balance);
    if (lastItem) {
      const rate = lastItem.total / lastItem.sumAmount;
      return balance / rate;
    }
    return +orders[orders.length - 1].sumAmount;
  }

  calcSellMarketOrder(orders, balance = 0) {
    if (!orders.length) {
      return 0;
    }

    const lastItem = orders[0];
    if (+lastItem.sumAmount < +balance) {
      return +lastItem.sumAmount;
    }
    return +balance;
  }

  calcMaxBuyMarketOrder(orders): number {
    const bal = (this.userBalance && this.userBalance.cur2 && this.userBalance.cur2.balance) || 0;
    return this.calcBuyMarketOrder(orders, bal);
  }

  calcMaxSellMarketOrder(orders): number {
    const bal = (this.userBalance && this.userBalance.cur1 && this.userBalance.cur1.balance) || 0;
    return this.calcSellMarketOrder(orders, bal);
  }

  marketOrderValidation(maxMarketOrder): ValidatorFn {
    return (control: AbstractControl) => {
      if (maxMarketOrder !== null && control.value && control.value > maxMarketOrder) {
        return { maxMarketOrder: true };
      }
      return null;
    };
  }

  redirectToVerification() {
    this.router.navigate(['settings/verification']);
  }
}
