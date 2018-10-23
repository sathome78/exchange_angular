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
    this.initForms();
  }

  showEditOrderPopup(order) {
    this.editOrderPopup = true;
    this.order.orderId = order.orderId;
    this.order.amount = order.amount;
    this.order.total = order.total;
    this.order.commission = order.commission;
  }

  cancelOrder(order) {

  }

  saveOrder() {

  }

  deleteOrder () {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  closePopup() {
    this.editOrderPopup = false;
  }

  quantityIput($event) {

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

}
