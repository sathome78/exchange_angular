import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Order} from './order.model';
import {TradingService} from './trading.service';
import {MarketService} from '../markets/market.service';
import {MockDataService} from '../../services/mock-data.service';
import {DashboardDataService} from '../dashboard-data.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss']
})
export class TradingComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** dashboard item name (field for base class)*/
  public itemName: string;
  /** active sell/buy tab */
  public mainTab;
  /** toggle for limits-dropdown */
  public isDropdownOpen = false;
  /** dropdown limit data */
  public limitsData = ['LIMIT', 'STOP_LIMIT', 'ICO'];
  /** selected limit */
  public dropdownLimitValue = this.limitsData[0];
  /** selected percent */
  public percents;
  /** form for limit-order */
  limitForm: FormGroup;
  /** form for limit-order */
  stopForm: FormGroup;

  public userBalance = 300000;
  public orderStop;
  public currentPair;
  public arrPairName: string[];
  private commissionIndex = 0.002;
  public commission = 0;
  public notifySuccess = false;
  public notifyFail = false;
  public message = '';

  constructor(
    public tradingService: TradingService,
    public marketService: MarketService,
    private ref: ChangeDetectorRef,
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
    commission: 0,
    baseType: this.dropdownLimitValue,
    total: null,
  };
  public order;

  ngOnInit() {
    this.itemName = 'trading';
    this.mainTab = 'BUY';
    this.order = {...this.defaultOrder};
    this.initForms();

    this.marketService.activeCurrencyListener
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(pair => {
        this.currentPair = pair;
        this.splitPairName();
        this.getCommissionIndex();
        // TODO: remove after dashboard init load time issue is solved
        this.ref.detectChanges();

      });

      this.marketService.currencyPairsInfo$.subscribe(res => {
        this.userBalance = res.balanceByCurrency1;
        this.order.rate = res.rate;
        this.setPriceInValue(res.rate);
      })

    this.dashboardDataService.selectedOrderTrading$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(order => {
        this.orderFromOrderBook(order);
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

  showLimit(value: string) {
    switch (value) {
      case 'LIMIT': {
        return 'Limit order';
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
    const quantityOf = this.userBalance * this.percents / 100;

    this.order.amount = quantityOf;
    this.setQuantityValue(quantityOf);

    this.getCommission();
    this.getTotalIn();
  }

  /**
   * on input in field quantity
   * @param e
   */
  quantityIput(e): void {
    this.order.amount = e.target.value;
    this.percents = null;
    this.getTotalIn();
  }

  /**
   * on input in field price in
   * @param e
   */
   rateInput(e): void {
    this.order.rate = e.target.value;
     this.getTotalIn();
   }

   totalInput(e): void {
     this.order.total = e.target.value;
     if (this.order.total > this.userBalance) {
       this.order.total = this.userBalance;
       this.setTotalInValue(this.userBalance);
     }
       if (this.order.rate > 0) {
         this.order.amount = this.order.total / this.order.rate;
         this.setQuantityValue(this.order.amount);
       }
   }

  /**
   * calculate commission
   */
  private getCommission(): void {
    this.order.commission = (this.order.rate * this.order.amount) * (this.commissionIndex / 100);
    if (this.mainTab === 'BUY') {
      const total = this.order.total + this.order.commission;
      this.order.total = total;
      this.setTotalInValue(total);
    } else {
      const total = this.order.total - this.order.commission;
      this.order.total = total;
      this.setTotalInValue(total);
    }
  }


  /**
   * calculate total field
   */
  private getTotalIn(): void {
    if (this.order.rate >= 0) {
      this.order.total = this.order.amount * this.order.rate;
      this.setTotalInValue(this.order.total);
    }
    this.getCommission();
  }

  /**
   * split pair name for showing
   */
  private splitPairName() {
    this.arrPairName = this.currentPair.currencyPairName.split('/');
  }

  setQuantityValue(value) {
    this.stopForm.controls['quantityOf'].setValue(value);
    this.limitForm.controls['quantityOf'].setValue(value);
  }

  setPriceInValue(value) {
    this.stopForm.controls['limit'].setValue(value);
    this.limitForm.controls['priceIn'].setValue(value);
  }

  setTotalInValue(value) {
    this.stopForm.controls['totalIn'].setValue(value);
    this.limitForm.controls['totalIn'].setValue(value);
  }

  setStopValue(value) {
    this.stopForm.controls['stop'].setValue(value);
  }

  getTotalValue() {
   return this.stopForm.controls['totalIn'].value;
  }

  resetForms() {
    this.limitForm.reset();
    this.stopForm.reset();
  }

  /**
   * fill model according to order-book order
   * @param order
   */
  orderFromOrderBook(order): void {
    console.log(order)
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
      this.order.currencyPairId = this.currentPair.currencyPairId;
      this.order.baseType = this.dropdownLimitValue;
      this.order.orderType = this.mainTab;
      if (this.dropdownLimitValue === 'STOP_LIMIT') {
        this.order.stop = this.orderStop;
      }
      this.order.orderId === 0 ? this.createNewOrder() : this.updateOrder();
  }

  /**
   * on create new order
   */
  createNewOrder(): void {
    this.tradingService.createOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        console.log(res);
      this.notifySuccess = true;
      setTimeout(() => {this.notifySuccess = false; }, 5000);
    }, err => {
        console.log(err);
        this.notifyFail = true;
        setTimeout(() => {this.notifyFail = false; }, 5000);
      });
    this.percents = null;
    this.orderStop = '';
    this.order = {...this.defaultOrder};
    this.resetForms();
  }

  /**
   * on update order from order-book
   */
  updateOrder(): void {
    this.tradingService.updateOrder(this.order)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
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
  }

  /**
   * get commission index (send request)
   */
  getCommissionIndex() {
    if (this.mainTab && this.currentPair.currencyPairId) {
      const subscription = this.tradingService.getCommission(this.mainTab, this.currentPair.currencyPairId).subscribe(res => {
        this.commissionIndex = res.commissionValue;
        this.getTotalIn();
        subscription.unsubscribe();
      });
    }
  }
}
