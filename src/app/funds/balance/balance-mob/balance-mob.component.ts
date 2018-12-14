import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';
import { BalanceDetailsItem } from 'app/funds/models/balance-details-item.model';

@Component({
  selector: 'app-balance-mob',
  templateUrl: './balance-mob.component.html',
  styleUrls: ['./balance-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceMobComponent implements OnInit{

  constructor() { 
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {'height': (componentHeight - 270) + 'px', 'overflow': 'scroll'}

  }
  @ViewChild('dropdown') dropdownElement: ElementRef;
  @ViewChild('scrollContainer') public scrollContainer: ElementRef;

  public screen = {
    MAIN: 'MAIN',
    DETAILS: 'DETAILS',
  }
  public currencies = {
    BTC: 'BTC',
    USD: 'USD',
  }

  public tableScrollStyles: any = {};
  public get currenciesArr() {
    return Object.keys(this.currencies);
  }
  public currScreen: string = this.screen.MAIN;
  public showOnConfirmation: boolean = false;
  public showReserve: boolean = false;
  public loadModeDisabled: boolean = false;
  public priceIn: string = this.currencies.USD;
  public hideAllZero: boolean = false;
  public currencyForChoose: string = '';

  @Input('balances') public balances: BalanceItem[] = [];
  @Input('countOfPendingRequests') public countOfPendingRequests: number = 0;
  @Input('selectedItem') public selectedItem: BalanceDetailsItem = null;
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Input('cryptoCurrenciesForChoose') public cryptoCurrenciesForChoose;
  @Input('fiatCurrenciesForChoose') public fiatCurrenciesForChoose;
  @Output('onToggleAllZero') public onToggleAllZero: EventEmitter<any> = new EventEmitter();
  @Output('onLoadMore') public onLoadMore: EventEmitter<any> = new EventEmitter();
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  @Output('filterByCurrencyForMobile') public filterByCurrencyForMobile: EventEmitter<any> = new EventEmitter();
  @Output('onBuyCurrency') public onBuyCurrency: EventEmitter<any> = new EventEmitter();
  @Output('onLoadBalanceConfirmInfo') public onLoadBalanceConfirmInfo: EventEmitter<any> = new EventEmitter();

  public onLoadMoreTrigger(): void {
    if(this.balances.length !== this.countOfEntries){
      this.onLoadMore.emit({currentPage: +this.currentPage + 1, countPerPage: this.countPerPage, concat: true}); 
    }
  }
  public onToggleAllZeroTrigger(): void {
    this.scrollContainer.nativeElement.scrollTop = 0;
    this.onToggleAllZero.emit(this.hideAllZero)
  }
  public onShowMobDetails(item: BalanceItem): void {
    this.onLoadBalanceConfirmInfo.emit(item.currencyId);
    this.currScreen = this.screen.DETAILS;
  }
  public onTogglePanels(panel): void {
    switch(panel){
      case 'on_confirmation':
        this.showOnConfirmation = !this.showOnConfirmation;
        break;
      case 'reserve':
        this.showReserve = !this.showReserve;
        break;
    }
  }

  public onSetScreen(screen: string): void {
    this.currScreen = screen;
  }

  public onToggleDropdown(): void {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  public onSelectCurrency(e): void {
    const element: HTMLElement = <HTMLElement>e.target;
    this.priceIn = this.currencies[element.innerText];
  }

  ngOnInit() {
    if(this.currTab === this.Tab.CRYPTO){
      this.priceIn = this.currencies.USD
    } else {
      this.priceIn = this.currencies.BTC
    }
  }

  public get getMarketPair(): string {
    if (this.selectedItem.currencyName === 'BTC') {
      return 'BTC-USD';
    } else {
      return `${this.selectedItem.currencyName}-BTC`
    }
  }

}
