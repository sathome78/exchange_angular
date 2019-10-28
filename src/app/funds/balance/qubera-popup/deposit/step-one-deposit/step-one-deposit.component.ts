import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _uniq from 'lodash/uniq';
import { CurrencyBalanceModel } from 'app/model';
import { select, Store } from '@ngrx/store';
import { getFiatCurrenciesForChoose, State } from 'app/core/reducers';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { BalanceService } from 'app/funds/services/balance.service';
import { FUG } from 'app/funds/balance/balance-constants';
import fileSaver from 'file-saver';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-step-one-deposit',
  templateUrl: './step-one-deposit.component.html',
  styleUrls: ['./step-one-deposit.component.scss'],
})
export class StepOneDepositComponent implements OnInit, OnDestroy {
  @Input() quberaBank: any;
  @Output() closeSendQuberaPopup = new EventEmitter<boolean>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public defaultFiatNames: CurrencyBalanceModel[] = [];
  public openPaymentSystemDropdown = false;
  public openCurrencyDropdown = false;
  public fiatArrayData;
  public fiatDataByName;
  public selectedMerchant;
  public selectMerchantName;
  public selectedMerchantNested;
  public minRefillSum = 0;
  public amountValue = 0;
  public activeBalance = 0;
  public minWithdrawSum = 0;
  public merchants;
  public searchTemplate = '';
  public activeFiat;
  public alphabet;
  public bankInfo;

  @ViewChild('content') content: ElementRef;

  @HostListener('document:click', ['$event']) clickout($event) {
    if (
      $event.target.className !== 'select__value select__value--active' &&
      $event.target.className !== 'select__value select__value--active select__value--error' &&
      $event.target.className !== 'select__search-input'
    ) {
      this.openPaymentSystemDropdown = false;
      // FUG BLOCK
      this.merchants =
        this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
          ? this.fiatDataByName.merchantCurrencyData.filter(i => this.utilsService.filterMerchants(i))
          : [];

      this.openCurrencyDropdown = false;
    }
  }

  constructor(private store: Store<State>, public balanceService: BalanceService, private utilsService: UtilsService) {}

  ngOnInit() {
    // FUG BLOCK
    this.merchants =
      this.quberaBank &&
      this.quberaBank.balance &&
      this.quberaBank.balance.merchantCurrencyData.filter(i => this.utilsService.filterMerchants(i));

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultFiatNames = currencies;
        // this.fiatNames = this.defaultFiatNames;
        this.fiatNames = this.defaultFiatNames.filter(el => el.name === 'EUR');
        this.setActiveFiat();
        if (this.activeFiat) {
          this.getDataByCurrency(this.activeFiat.name);
        }
        this.prepareAlphabet();
      });
    this.depositBankInfo();
  }

  ngOnDestroy() {
    this.bankInfo = null;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectCurrency(currency) {
    this.activeFiat = currency;
    this.toggleCurrencyDropdown();
    this.getDataByCurrency(currency.name);
  }

  selectMerchant(merchant, merchantImage = null) {
    this.selectedMerchantNested = merchantImage;
    this.selectMerchantName = merchantImage.image_name || merchant.name;
    this.selectedMerchant = merchant;
    this.togglePaymentSystemDropdown();
    this.setMinRefillSum();
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    this.merchants = this.fiatDataByName && this.fiatDataByName ? this.fiatDataByName : [];
    this.searchTemplate = '';
    this.openCurrencyDropdown = false;
  }

  private getDataByCurrency(currencyName) {
    this.balanceService
      .getCurrencyRefillData(currencyName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatArrayData = res;
        this.fiatDataByName = this.fiatArrayData.merchantCurrencyData.filter(item => item.name === FUG);
        this.merchants = this.fiatDataByName;
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
        this.selectedMerchantNested = this.selectedMerchant ? this.selectedMerchant.listMerchantImage[0] : null;
        this.selectMerchantName = this.selectedMerchantNested ? this.selectedMerchantNested.image_name : '';
        if (this.selectedMerchant) {
          this.setMinRefillSum();
        }
      });
  }

  private setMinRefillSum() {
    this.minRefillSum =
      this.fiatDataByName.minRefillSum > parseFloat(this.selectedMerchant.minSum)
        ? this.fiatDataByName.minRefillSum
        : parseFloat(this.selectedMerchant.minSum);
  }

  searchMerchant(e) {
    this.searchTemplate = e.target.value;
    this.merchants = this.fiatDataByName.filter(
      merchant =>
        !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase()))
          .length
    );
  }

  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
    this.prepareAlphabet();
  }

  bankDropdownToggle() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    this.openCurrencyDropdown = false;
  }

  setActiveFiat() {
    let currency;
    if (this.quberaBank.balance && this.quberaBank.balance.currenciesId[0]) {
      currency = this.fiatNames.filter(item => +item.id === +this.quberaBank.balance.currenciesId[0]);
    }
    this.activeFiat = currency && currency.length ? currency[0] : this.fiatNames[0];
  }

  prepareAlphabet() {
    const temp = [];
    this.fiatNames.forEach(currency => {
      const letter = currency.name.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  download(url) {
    this.balanceService
      .downloadQuberaInvoice(url)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data: any) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          fileSaver(blob, 'invoice.pdf');
        },
        err => {
          console.error(err);
        }
      );
  }

  depositBankInfo() {
    this.balanceService
      .getBankInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.bankInfo = data.data;
      });
  }

  trackByFiatName(index, item) {
    return item.id;
  }
  trackByMerchants(index, item) {
    return index;
  }
}
