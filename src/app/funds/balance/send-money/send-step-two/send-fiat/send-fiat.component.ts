import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {CurrencyBalanceModel} from '../../../../../model';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../../shared/services/balance.service';
import {takeUntil} from 'rxjs/operators';
import {MockDataService} from '../../../../../shared/services/mock-data.service';

@Component({
  selector: 'app-send-fiat',
  templateUrl: './send-fiat.component.html',
  styleUrls: ['./send-fiat.component.scss']
})
export class SendFiatComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public openCurrencyDropdown = false;
  public openPaymentSystemDropdown = false;
  public fiatInfoByName;
  public merchants;
  public selectedMerchant;
  public activeFiat;
  public form: FormGroup;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active' && $event.target.className !== 'select__search-input') {
      this.openCurrencyDropdown = false;
      this.openPaymentSystemDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public mockDataService: MockDataService,
  ) { }

  ngOnInit() {
    this.initForm();
    // /**-------mock data------**/
    // this.fiatNames = this.mockDataService.getFiatNames();
    // this.fiatInfoByName = this.mockDataService.getCryptoData();
    // this.activeFiat = this.fiatNames[0];
    // /**----------------------**/
    this.balanceService.getFiatNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatNames = res;
        this.activeFiat = this.fiatNames[0];
        this.getFiatInfoByName(this.activeFiat.name);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectCurrency(currency) {
    this.activeFiat = currency;
    this.currencyDropdownToggle();
  }
  selectMerchant(merchant) {
    this.selectedMerchant = merchant;
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    this.openCurrencyDropdown = false;
  }

  private getFiatInfoByName(name: string) {
    this.balanceService.getCurrencyData(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatInfoByName = res;
        this.merchants = this.fiatInfoByName.merchantCurrencyData;
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : {};
        console.log(res);
      });
  }

  searchMerchant(e) {
    this.merchants = this.fiatInfoByName.merchantCurrencyData.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
  }

  private initForm() {
    this.form = new FormGroup({
      address: new FormControl('', [Validators.required] ),
      amount: new FormControl('', [Validators.required, this.minCheck.bind(this)] ),
    });
  }

  private minCheck(amount: FormControl) {
    if (this.fiatInfoByName && this.fiatInfoByName.minRefillSum > amount.value) {
      return {'minThen': true};
    }
    return null;
  }

}
