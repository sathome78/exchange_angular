import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MockDataService} from '../../../services/mock-data.service';
import {OpenOrders} from '../open-orders.model';
import {OrdersService} from '../orders.service';
import {MarketService} from '../../markets/market.service';
import {CurrencyPair} from '../../markets/currency-pair.model';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/internal/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TradingService} from '../../trading/trading.service';
import {Order} from '../../trading/order.model';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit, OnDestroy {
  @Output() countOpenOrders: EventEmitter<number> = new EventEmitter();

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public openOrders: OpenOrders[];
  public currentPair;
  public commissionIndex;
  public orderType = 'BUY'
  public editOrderPopup = false;
  public limitsData = ['LIMIT', 'STOP_LIMIT', 'ICO'];
  public dropdownLimitValue = this.limitsData[0];
  public isDropdownOpen = false;
  public arrPairName: string[];
  public orderStop;
  limitForm: FormGroup;
  stopForm: FormGroup;

  public defaultOrder: Order = {
    orderType: '',
    orderId: 0,
    currencyPairId: null,
    amount: null,
    rate: null,
    commission: 0,
    baseType: this.dropdownLimitValue,
    total: null,
  };
  public order;

  constructor(
    private mockData: MockDataService,
    private ordersService: OrdersService,
    private marketService: MarketService,
    public tradingService: TradingService,
  ) { }


  ngOnInit() {
    this.order = {...this.defaultOrder};
    this.openOrders = this.mockData.getOpenOrders();
    console.log(this.openOrders);
    this.countOpenOrders.emit(this.openOrders.length);
    this.currentPair = this.mockData.getMarketsData()[2];
    this.splitPairName()
     this.marketService.activeCurrencyListener
       .pipe(takeUntil(this.ngUnsubscribe))
       .subscribe(pair => {
       this.currentPair = pair;
       this.ordersService.getOpenOrders(this.currentPair.currencyPairId)
         .pipe(takeUntil(this.ngUnsubscribe))
         .subscribe(res => {
         this.openOrders = res;
         this.countOpenOrders.emit(this.openOrders.length);
       });
     });
    this.tradingService.tradingChangeSellBuy$.subscribe(type => {
      this.orderType = type as string;
      this.getCommissionIndex();
    })
    this.initForms();
  }

  showEditOrderPopup(order) {
    this.editOrderPopup = true;
    this.getCommissionIndex();
    this.order.orderId = order.orderId;
    this.order.amount = order.amount;
    this.order.total = order.total;
    this.order.orderType = this.orderType;
    this.order.currencyPairId = this.currentPair.currencyPairId;
    this.order.rate = order.total / order.amount;
    this.order.commission = order.commission;
  }

  cancelOrder(order) {
   order.status = 'CANCELED';
   this.tradingService.updateOrder(order).subscribe(res => console.log(res));
    console.log(order);
  }

  saveOrder() {
    if (this.order.baseType === 'STOP_LIMIT') {
      this.order.stop = this.orderStop;
    }
    this.orderStop = '';
    this.editOrderPopup = false;
  }

  deleteOrder (order) {
    this.tradingService.deleteOrder(order.orderId).subscribe(res => console.log(res));
    this.editOrderPopup = false;

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  closePopup() {
    this.editOrderPopup = false;
  }

  quantityIput($event) {
    this.getCommission();
  }

  rateInput($event) {
  }

  selectedLimit(limit) {
    this.dropdownLimitValue = limit;
  }

  private splitPairName() {
    this.arrPairName = this.currentPair.currencyPairName.split('/');
  }

  toggleLimitDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  private getCommission() {
    this.order.commission = (this.order.rate * this.order.amount) * (this.commissionIndex / 100);
    this.order.total += this.order.commission;
  }

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

  getCommissionIndex() {
    this.commissionIndex = 0.02;
    if (this.orderType && this.currentPair.currencyPairId) {
      const subscription = this.tradingService.getCommission(this.orderType, this.currentPair.currencyPairId).subscribe(res => {
        this.commissionIndex = res.commissionValue;
        console.log(this.commissionIndex);
        // subscription.unsubscribe();
      });
    }
  }
}
