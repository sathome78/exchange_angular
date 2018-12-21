import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';
import {Router} from '@angular/router';
import {UtilsService} from 'app/shared/services/utils.service';

@Component({
  selector: 'app-balance-mob',
  templateUrl: './balance-mob.component.html',
  styleUrls: ['./balance-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceMobComponent implements OnInit{

  constructor(
    private router: Router,
    private utils: UtilsService,
  ) {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {'height': (componentHeight - 271) + 'px', 'overflow': 'scroll'}

  }
  @ViewChild('dropdown') dropdownElement: ElementRef;
  @ViewChild('scrollContainer') public scrollContainer: ElementRef;

  public currencies = {
    BTC: 'BTC',
    USD: 'USD',
  }

  public tableScrollStyles: any = {};
  public get currenciesArr() {
    return Object.keys(this.currencies);
  }

  public loadModeDisabled: boolean = false;
  public priceIn: string = this.currencies.USD;
  public hideAllZero: boolean = false;
  public currencyForChoose: string = '';

  @Input('balances') public balances: BalanceItem[] = [];
  @Input('Tab') public Tab;
  @Input('currTab') public currTab;
  @Input('countOfPendingRequests') public countOfPendingRequests: number = 0;
  @Input('cryptoCurrenciesForChoose') public cryptoCurrenciesForChoose;
  @Input('fiatCurrenciesForChoose') public fiatCurrenciesForChoose;
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;

  @Output('openRefillBalancePopup') public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output('openSendMoneyPopup') public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  @Output('filterByCurrencyForMobile') public filterByCurrencyForMobile: EventEmitter<any> = new EventEmitter();
  @Output('onToggleAllZero') public onToggleAllZero: EventEmitter<any> = new EventEmitter();
  @Output('onLoadMore') public onLoadMore: EventEmitter<any> = new EventEmitter();
  @Output('onSelectTab') public onSelectTab: EventEmitter<any> = new EventEmitter();
  @Output('onGoToBalanceDetails') public onGoToBalanceDetails: EventEmitter<any> = new EventEmitter();

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
    this.onGoToBalanceDetails.emit({currencyId: item.currencyId, priceIn: this.priceIn});
  }

  public onToggleDropdown(): void {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  public onSelectCurrency(e): void {
    const element: HTMLElement = <HTMLElement>e.target;
    this.priceIn = this.currencies[element.innerText];
  }
  public onGoToPendingReq(): void {
    this.router.navigate(['/funds/pending-requests'])
  }

  public isFiat(currName: string): boolean {
    return this.utils.isFiat(currName);
  }

  ngOnInit() { }

}
