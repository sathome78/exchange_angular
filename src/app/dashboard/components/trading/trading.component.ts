import {Component, OnDestroy, OnInit, HostListener, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs/Subject';
import {takeUntil, withLatestFrom} from 'rxjs/internal/operators';
import {select, Store} from '@ngrx/store';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {State, getActiveCurrencyPair, getLastPrice, getSelectedOrderBookOrder, getDashboardState, getIsAuthenticated} from 'app/core/reducers/index';
import {CurrencyPair} from 'app/model/currency-pair.model';
import {UserService} from 'app/shared/services/user.service';
import {OrderItem, UserBalance} from 'app/model';
import {PopupService} from 'app/shared/services/popup.service';
import {SelectedOrderBookOrderAction, SetLastCreatedOrderAction} from '../../actions/dashboard.actions';
import {defaultOrderItem} from '../../reducers/default-values';
import {AuthService} from 'app/shared/services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {LastPrice} from 'app/model/last-price.model';
import {BUY, SELL} from 'app/shared/constants';
import {DashboardWebSocketService} from '../../dashboard-websocket.service';
import {Order} from 'app/model/order.model';
import {TradingService} from 'app/dashboard/services/trading.service';
import {BreakpointService} from 'app/shared/services/breakpoint.service';

@Component({
  selector: 'app-trading',
  templateUrl: 'trading.component.html',
  styleUrls: ['trading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingComponent extends AbstractDashboardItems implements OnInit, OnDestroy {


  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public isAuthenticated: boolean = false;
  /** dashboard item name (field for base class)*/
  public itemName: string = 'trading';
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
  public isPossibleSetPrice = true;
  public currentPair;

  public notifySuccess = false;
  public notifyFail = false;
  public message = '';
  public order;
  public lastSellOrder;
  public isTotalWithCommission = false;
  public SELL = SELL;
  public BUY = BUY;
  public createdOrder: Order;
  private updateCurrentCurrencyViaWebsocket = false;

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
    public breakpointService: BreakpointService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private popupService: PopupService,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
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
      .subscribe(([isAuth, pair]: [boolean, CurrencyPair]) => {
        this.isAuthenticated = isAuth;
        this.onGetCurrentCurrencyPair(pair, isAuth); // get commission when you login
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getDashboardState))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {
        this.userBalance = state.userBalance;
      });

    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(withLatestFrom(this.store.pipe(select(getIsAuthenticated))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([pair, isAuth]: [CurrencyPair, boolean]) => {
        this.isAuthenticated = isAuth;
        this.onGetCurrentCurrencyPair(pair, isAuth); // get commission when you change currency pair
        this.cdr.detectChanges();
      });

    // this.dashboardWebsocketService.setRabbitStompSubscription()
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(() => {
    //     this.updateCurrentCurrencyViaWebsocket = true;
    //     this.cdr.detectChanges();
    //   })


    this.store
      .pipe(select(getLastPrice))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (lastPrice: LastPrice) => {
        if (!this.updateCurrentCurrencyViaWebsocket && this.isPossibleSetPrice) {
          this.setPriceInValue(lastPrice.price, this.BUY);
          this.setPriceInValue(lastPrice.price, this.SELL);
          this.sellOrder.rate = lastPrice.price ?  parseFloat(lastPrice.price.toString()) : 0;
          this.buyOrder.rate = lastPrice.price ?  parseFloat(lastPrice.price.toString()) : 0;
        }
        this.updateCurrentCurrencyViaWebsocket = false;
        this.cdr.detectChanges();
      });

    this.store
      .pipe(select(getSelectedOrderBookOrder))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (order) => {
        this.orderFromOrderBook(order);
        this.cdr.detectChanges();
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
  showLimit(value: string, popup: boolean = false): string {
    switch (value) {
      case 'LIMIT': {
        return popup ? this.translateService.instant('Limit') : this.translateService.instant('Limit order');
      }
      case 'MARKET_PRICE': {
        return this.translateService.instant('Market price');
      }
      case 'STOP_LIMIT': {
        return popup ? this.translateService.instant('Stop limit') : this.translateService.instant('Stop limit');
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
    this.sellOrder.rate = rate;
    this.setPriceInValue(rate, this.SELL);
    this.buyOrder.rate = rate;
    this.setPriceInValue(rate, this.BUY);
    this.getCommission(this.SELL);
    this.getCommission(this.BUY);
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
          type === this.BUY ?
            this.buyCommissionIndex = res.commissionValue :
            this.sellCommissionIndex = res.commissionValue;
          this.cdr.detectChanges();
        });
    }
  }

  /**
   * Method run when refresh current currency pair
   * @param pair
   */
  private onGetCurrentCurrencyPair(pair, isAuth): void {
    this.isPossibleSetPrice = true;
    this.currentPair = pair;
    this.resetSellModel();
    this.resetBuyModel();
    this.splitPairName();
    if(isAuth) {
      this.getCommissionIndex(this.BUY, this.currentPair.currencyPairId);
      this.getCommissionIndex(this.SELL, this.currentPair.currencyPairId);
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
        order.total = (((order.amount * order.rate) * 100) / 100);
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
    const value = event.target.value === '' ? 0 : event.target.value;
    this.setTotalInValue(value, type);
    order.total = parseFloat(this.deleteSpace(value));
    if (order.rate) {
      order.amount = order.total / order.rate;
      order.commission =  value > 0 ? order.total * ((type === this.BUY ? this.buyCommissionIndex : this.sellCommissionIndex) / 100) : 0;
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
    if (!this.isAuthenticated) {
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
    // type === 'BUY' ?
    //   console.log(this.buyOrder) :
    //   console.log(this.sellOrder);

    const order = type === this.BUY ? this.buyOrder : this.sellOrder;
    this.createdOrder = order;
    this.tradingService.createOrder(order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.store.dispatch(new SetLastCreatedOrderAction(order))
        this.userService.getUserBalance(this.currentPair);
        type === this.BUY ? this.resetBuyModel() : this.resetSellModel();

        this.store.dispatch(new SelectedOrderBookOrderAction(defaultOrderItem));
        this.notifySuccess = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.notifySuccess = false;
          this.createdOrder = null;
          this.cdr.detectChanges();
          }, 5000);
      }, err => {
        console.log(err);
        this.notifyFail = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.notifyFail = false;
          this.createdOrder = null;
          this.cdr.detectChanges();
          }, 5000);
      });
  }

}
