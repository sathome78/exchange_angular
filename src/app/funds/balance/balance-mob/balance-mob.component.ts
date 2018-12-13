import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';

@Component({
  selector: 'app-balance-mob',
  templateUrl: './balance-mob.component.html',
  styleUrls: ['./balance-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceMobComponent implements OnInit{

  constructor() { }
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
  public get currenciesArr() {
    return Object.keys(this.currencies);
  }
  public currScreen: string = this.screen.MAIN;
  public showOnConfirmation: boolean = false;
  public showReserve: boolean = false;
  public loadModeDisabled: boolean = false;
  public priceIn: string = this.currencies.USD;
  public selectedItem: BalanceItem = null;

  @Input('balances') public balances: BalanceItem[] = [];
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Input('hideAllZero') public hideAllZero;
  @Output('onToggleAllZero') public onToggleAllZero: EventEmitter<any> = new EventEmitter();
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  // @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();

  public onLoadMore(): void {
    if(this.balances.length !== this.countOfEntries){
      this.onPaginate.emit({currentPage: +this.currentPage + 1, countPerPage: this.countPerPage}); 
    }
  }
  public onShowMobDetails(item: BalanceItem): void {
    this.selectedItem = item;
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

}
