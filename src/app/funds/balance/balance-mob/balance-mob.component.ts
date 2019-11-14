import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { BalanceItem } from '../../models/balance-item.model';
import { Router } from '@angular/router';
import { UtilsService } from 'app/shared/services/utils.service';
import * as fundsAction from '../../store/actions/funds.actions';
import { select, Store } from '@ngrx/store';
import * as fromCore from '../../../core/reducers';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-balance-mob',
  templateUrl: './balance-mob.component.html',
  styleUrls: ['./balance-mob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceMobComponent implements OnInit {
  @ViewChild('dropdown') dropdownElement: ElementRef;
  @ViewChild('scrollContainer') public scrollContainer: ElementRef;

  public currencies = {
    BTC: 'BTC',
    USD: 'USD',
  };

  public tableScrollStyles: any = {};
  public get currenciesArr() {
    return Object.keys(this.currencies);
  }
  public startAnimation = false;
  public loadModeDisabled = false;
  public priceIn: string = this.currencies.USD;
  public hideAllZero = false;
  public currencyForChoose = '';
  public currValue = '';
  public isShowSearchPopup = false;
  @Input() public leaveAnimationFn: boolean;
  @Input() public loading: boolean;
  @Input() public balances: BalanceItem[] = [];
  @Input() public countEntries = 0;
  @Input() public Tab;
  @Input() public currTab;
  @Input() public countOfPendingRequests = 0;
  @Input() public cryptoCurrenciesForChoose;
  @Input() public fiatCurrenciesForChoose;
  @Input() public countPerPage: number;
  @Input() public currentPage: number;
  @Input() public countOfEntries: number;

  @Output() public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output() public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  @Output()
  public filterByCurrencyForMobile: EventEmitter<any> = new EventEmitter();
  @Output() public toggleAllZero: EventEmitter<any> = new EventEmitter();
  @Output() public loadMore: EventEmitter<any> = new EventEmitter();
  @Output() public selectTab: EventEmitter<any> = new EventEmitter();
  @Output() public goToBalanceDetails: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    public utils: UtilsService,
    private cdr: ChangeDetectorRef,
    private store: Store<fromCore.State>
  ) {
    this.setScrollStyles();
  }

  setScrollStyles() {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {
      height: componentHeight - 293 + 'px',
      'overflow-x': 'scroll',
    };
  }

  public onLoadMoreTrigger(): void {
    if (this.balances.length !== this.countOfEntries) {
      this.loadMore.emit({
        currentPage: +this.currentPage + 1,
        countPerPage: this.countPerPage,
        concat: true,
      });
    }
  }
  public onToggleAllZeroTrigger(): void {
    this.scrollContainer.nativeElement.scrollTop = 0;
    this.toggleAllZero.emit(this.hideAllZero);
  }
  public onShowMobDetails(item: BalanceItem): void {
    this.goToBalanceDetails.emit({
      currencyId: item.currencyId,
      priceIn: this.priceIn,
    });
  }

  public onToggleDropdown(): void {
    this.dropdownElement.nativeElement.classList.toggle('dropdown--open');
  }

  public onSelectCurrency(e): void {
    const element: HTMLElement = <HTMLElement>e.target;
    this.priceIn = this.currencies[element.innerText];
  }
  public onGoToPendingReq(): void {
    this.router.navigate(['/funds/pending-requests']);
  }

  public isFiat(currName: string): boolean {
    return this.utils.isFiat(currName);
  }

  public onSearchCoin(event) {
    this.currencyForChoose = event;
    this.filterByCurrencyForMobile.emit({
      currTab: this.currTab,
      currency: this.currencyForChoose,
    });
  }

  public onChangeCurrPair(val: string): void {
    this.currValue = val;
  }

  public get getCryptoDynamicIData(): DIOptions[] {
    return this.cryptoCurrenciesForChoose.map(item => ({
      text: `${item.name}; ${item.description}`,
      id: item.id,
    }));
  }
  public get getFiatDynamicIData(): DIOptions[] {
    return this.fiatCurrenciesForChoose.map(item => ({
      text: `${item.name}; ${item.description}`,
      id: item.id,
    }));
  }

  public toggleShowSearchPopup(flag: boolean) {
    if (flag && this.balances.length < this.countEntries) {
      const params = {
        type: this.currTab === this.Tab.CRYPTO ? this.Tab.CRYPTO : this.Tab.FIAT,
        limit: this.countEntries,
        excludeZero: false,
        concat: false,
        currencyId: 0,
        currencyName: '',
        offset: '',
      };
      this.currTab === this.Tab.CRYPTO
        ? this.store.dispatch(new fundsAction.LoadCryptoBalAction(params))
        : this.store.dispatch(new fundsAction.LoadFiatBalAction(params));
    }
    this.isShowSearchPopup = flag;
  }
  get showContent(): boolean {
    return environment.showContent;
  }

  ngOnInit() {
    setTimeout(() => {
      this.startAnimation = true;
      if (!this.cdr['destroyed']) {
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  trackByFn(index, item) {
    return item.currencyId;
  }
}
