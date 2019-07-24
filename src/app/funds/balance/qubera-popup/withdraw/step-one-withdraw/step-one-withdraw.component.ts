import { Component, OnInit, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getFiatCurrenciesForChoose, State } from 'app/core/reducers';
import * as fromCore from '../../../../../core/reducers';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _uniq from 'lodash/uniq';
import { CurrencyBalanceModel } from 'app/model';
import { BalanceService } from 'app/funds/services/balance.service';
import { Sepa } from 'app/funds/models/sepa.model';
import { Swift } from 'app/funds/models/swift.model';
import { KycCountry } from 'app/shared/interfaces/kyc-country-interface';
import { SettingsService } from 'app/settings/settings.service';
import * as settingsActions from '../../../../../settings/store/actions/settings.actions';
import { CommissionData } from 'app/funds/models/commission-data.model';
import {defaultCommissionData} from '../../../../store/reducers/default-values';

@Component({
  selector: 'app-step-one-withdraw',
  templateUrl: './step-one-withdraw.component.html',
  styleUrls: ['./step-one-withdraw.component.scss']
})
export class StepOneWithdrawComponent implements OnInit {
  form: FormGroup;
  formSepa: FormGroup;
  formSwift: FormGroup;

  withdrawOptions = ['FUG SEPA', 'FUG SWIFT'];
  selectedWithdraw = '';
  currName = 'EUR';
  forCompany = false;

  @Input() dataQubera: any;
  @Input() quberaBalances: any;
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public defaultFiatNames: CurrencyBalanceModel[] = [];
  public openBankSystemDropdown = false;
  public openCurrencyDropdown = false;
  public searchTemplate = '';
  public fiatDataByName;
  public fiatArrayData;
  public selectedMerchant;
  public selectMerchantName;
  public selectedMerchantNested;
  public minRefillSum = 0;
  public merchants;
  public activeFiat;
  public alphabet;


  public minWithdrawSum = 0;
  public activeBalance = 0;
  public amountValue = 0;
  public calculateData: CommissionData = defaultCommissionData;


  // country

  public openCountryDropdown: Boolean = false;
  public showCountryLabelFlag: Boolean = false;
  public selectedCountry;
  public countryArray: KycCountry[] = [];
  public countryArrayDefault: KycCountry[] = [];

  @ViewChild('countryInput') countryInput: ElementRef;

  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active'
      && $event.target.className !== 'select__value select__value--active select__value--error'
      && $event.target.className !== 'select__search-input') {
      this.openBankSystemDropdown = false;
      this.openCurrencyDropdown = false;
      this.openCountryDropdown = false;
      this.merchants = this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
        ? this.fiatDataByName.merchantCurrencyData
        : [];
    }
  }

  constructor(
    private store: Store<State>,
    private stores: Store<fromCore.State>,
    private settingsService: SettingsService,
    public balanceService: BalanceService) {
      this.selectedWithdraw = this.withdrawOptions[0];
    }

  checkForm(value) {
    this.selectedWithdraw = value;
    if (this.selectedWithdraw === this.withdrawOptions[0]) {
      this.initSepaForm();
    } else {
      this.initSwiftForm();
    }
  }

  ngOnInit() {
    this.initMainForm();

    this.initSepaForm();
    this.getCountryCode();
    this.stores.dispatch(new settingsActions.LoadGAStatusAction());

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultFiatNames = currencies;
        // this.fiatNames = this.defaultFiatNames;
        this.fiatNames.push(this.defaultFiatNames[2]);
        this.setActiveFiat();
        if (this.activeFiat) {
          this.getDataByCurrency(this.activeFiat.name);
        }
        this.prepareAlphabet();
      });
    // this.activeBalance = this.quberaBalances.availableBalance.amount;
  }

  setActiveFiat() {
    let currency;
    if (this.dataQubera.balance && this.dataQubera.balance.currenciesId[0]) {
      currency = this.fiatNames.filter(item => +item.id === +this.dataQubera.balance.currenciesId[0]);
    }
    this.activeFiat = (currency && currency.length) ? currency[0] : this.fiatNames[0];
  }

  private getDataByCurrency(currencyName) {
    this.balanceService.getCurrencyRefillData(currencyName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        // this.fiatDataByName = res;
        this.fiatArrayData = res;
        this.fiatDataByName = this.fiatArrayData.merchantCurrencyData.filter(item => (item.name === 'Qubera'));
        // this.merchants = this.fiatDataByName.merchantCurrencyData;
        this.merchants = this.fiatDataByName;
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
        this.selectedMerchantNested = this.selectedMerchant ? this.selectedMerchant.listMerchantImage[0] : null;
        this.selectMerchantName = this.selectedMerchantNested ? this.selectedMerchantNested.image_name : '';
        this.form.get('amount').updateValueAndValidity();
        if (this.selectedMerchant) {
          this.setMinRefillSum();
          this.setMinWithdrawSum();
        }
      });
  }

  togglePaymentSystemDropdown() {
    this.openBankSystemDropdown = !this.openBankSystemDropdown;
    this.merchants = this.fiatDataByName && this.fiatDataByName
      ? this.fiatDataByName
      : [];
    this.searchTemplate = '';
    this.openCurrencyDropdown = false;
  }

  selectCurrency(currency) {
    this.activeFiat = currency;
    this.toggleCurrencyDropdown();
    this.getDataByCurrency(currency.name);
  }

  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openBankSystemDropdown = false;
    this.openCountryDropdown = false;
    this.prepareAlphabet();
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

  private setMinRefillSum() {
    this.minRefillSum = this.fiatDataByName.minRefillSum > parseFloat(this.selectedMerchant.minSum)
      ? this.fiatDataByName.minRefillSum
      : parseFloat(this.selectedMerchant.minSum);
  }

  private setMinWithdrawSum() {
    this.minWithdrawSum = this.fiatDataByName.minWithdrawSum > parseFloat(this.selectedMerchant.minSum)
      ? this.fiatDataByName.minWithdrawSum
      : parseFloat(this.selectedMerchant.minSum);
    this.form.controls['amount'].updateValueAndValidity();
  }

  initMainForm() {
    this.form = new FormGroup({
      amount: new FormControl('', [
        Validators.required,
        this.isMaxThenActiveBalance.bind(this),
        this.isMinThenMinWithdraw.bind(this)
      ])
    });
  }

  isMaxThenActiveBalance(): {[key: string]: any} | null {
    if (+this.activeBalance < +this.amountValue) {
      return {'isMaxThenActiveBalance': true};
    }
    return null;
  }

  isMinThenMinWithdraw(): {[key: string]: any} | null {
    if (+this.minWithdrawSum > +this.amountValue) {
      return {'isMinThenMinWithdraw': true};
    }
    return null;
  }

  balanceClick(bal) {
    if (bal > this.minWithdrawSum) {
      this.form.controls['amount'].setValue(bal.toString());
      this.calculateCommission(bal);
      this.amountValue = bal;
    }
  }

  calculateCommission(amount) {
    if (this.form.controls['amount'].valid && this.selectedMerchant.merchantId) {
      this.balanceService
        .getCommissionToWithdraw(amount, this.activeFiat.id, this.selectedMerchant.merchantId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.calculateData = res as CommissionData;
          const compCommission = parseFloat(this.calculateData.companyCommissionRate.replace('%)', '').replace('(', ''));
          this.calculateData.commission_rates_sum =
            +this.selectedMerchant.outputCommission + (Number.isNaN(compCommission) ? compCommission : 0);
        });
    } else {
      const outCommission = !!this.selectedMerchant ? this.selectedMerchant.outputCommission : 0;
      const fixCommission = !!this.selectedMerchant ? this.selectedMerchant.fixedMinCommission : 0;
      this.calculateData.merchantCommissionRate = `(${outCommission}%, but not less than ${fixCommission} USD)`;
    }
  }

  amountBlur(event) {
    if (event && this.form.controls['amount'].valid) {
      this.calculateCommission(this.amountValue);
    }
  }

  amountInput(event) {
    this.amountValue = event.target.value;
  }

  initSwiftForm() {
    this.formSwift = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      companyName: new FormControl(''),
      accountNumber: new FormControl('', Validators.required),
      swift: new FormControl('', Validators.required),
      narrative: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required)
    });
  }

  initSepaForm() {
    this.formSepa = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      companyName: new FormControl(''),
      iban: new FormControl('', Validators.required),
      narrative: new FormControl('', Validators.required)
    });
  }

  searchMerchant(e) {
    this.searchTemplate = e.target.value;
    this.merchants = this.fiatDataByName.filter(merchant =>
      !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase())).length
    );
  }

  submit(mainForm, withdrawForm) {
    if (mainForm.valid && withdrawForm.valid) {
      const withdraw = this.createWithdrawObject(mainForm, withdrawForm);
      this.balanceService.sendWithdraw(withdraw)
        .pipe(first())
        .subscribe(data => {
          this.balanceService.setWithdrawQubera(data);
          this.nextStep.emit(2);
        });
    }
  }

  createWithdrawObject(mainForm, withdrawForm) {
    if (this.selectedWithdraw === this.withdrawOptions[0]) {
      return this.fillSepaForm(mainForm, withdrawForm);
    }
    return this.fillSwiftForm(mainForm, withdrawForm);
  }

  fillSepaForm(mainForm, withdrawForm) {
    const withdraw = new Sepa();
    withdraw.amount = `${mainForm.value.amount}`;
    withdraw.currencyCode = `${this.activeFiat.name}`;
    withdraw.firstName = withdrawForm.value.firstName;
    withdraw.lastName = withdrawForm.value.lastName;
    withdraw.companyName = withdrawForm.value.companyName;
    withdraw.narrative = withdrawForm.value.narrative;
    withdraw.iban = withdrawForm.value.iban;
    withdraw.type = 'SEPA';
    return withdraw;
  }

  fillSwiftForm(mainForm, withdrawForm) {
    const withdraw = new Swift();
    withdraw.amount = `${mainForm.value.amount}`;
    withdraw.currencyCode = `${this.activeFiat.name}`;
    withdraw.firstName = withdrawForm.value.firstName;
    withdraw.lastName = withdrawForm.value.lastName;
    withdraw.companyName = withdrawForm.value.companyName;
    withdraw.accountNumber = withdrawForm.value.accountNumber;
    withdraw.swift = withdrawForm.value.swift;
    withdraw.narrative = withdrawForm.value.narrative;
    withdraw.type = 'SWIFT';
    withdraw.address = withdrawForm.value.address;
    withdraw.city = withdrawForm.value.city;
    withdraw.countryCode = this.selectedCountry.countryCode;
    return withdraw;
  }

  getCountryCode() {
    this.settingsService.getCountriesKYC()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.countryArrayDefault = res as KycCountry[];
        this.countryArray = this.countryArrayDefault;
      });
  }

  countryDropdownToggle() {
    this.countryInput.nativeElement.value = this.selectedCountry ? this.selectedCountry.countryName : '';
    this.openCountryDropdown = !this.openCountryDropdown;
    this.openBankSystemDropdown = false;
    this.openCurrencyDropdown = false;
    this.countryArray = this.countryArrayDefault;
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.countryDropdownToggle();
    this.formSwift.controls.countryCode.setValue(country.countryCode);
  }

  searchCountry(e) {
    this.countryArray = this.countryArrayDefault.filter(f => f.countryName.toUpperCase().match(e.target.value.toUpperCase()));
  }


// getters form Sepa
  get currentSEPAFirstName(): any {
    return this.formSepa.get('firstName');
  }
  get currentSEPALastName(): any {
    return this.formSepa.get('lastName');
  }
  get currentSEPAACompanyName(): any {
    return this.formSepa.get('companyName');
  }
  get currentSEPANarrative(): any {
    return this.formSepa.get('narrative');
  }

  get currentSEPAIban(): any {
    return this.formSepa.get('iban');
  }

// getters form SWIFT
  get currentSWIFTFirstName(): any {
    return this.formSwift.get('firstName');
  }
  get currentSWIFTLastName(): any {
    return this.formSwift.get('lastName');
  }
  get currentSWIFTACompanyName(): any {
    return this.formSwift.get('companyName');
  }

  get currentSWIFTAccountNumbere(): any {
    return this.formSwift.get('accountNumber');
  }

  get currentSWIFTNumber(): any {
    return this.formSwift.get('swift');
  }
  get currentSWIFTNarrative(): any {
    return this.formSwift.get('narrative');
  }

  get currentSWIFTAddress(): any {
    return this.formSwift.get('address');
  }

  get currentSWIFTCity(): any {
    return this.formSwift.get('city');
  }

}
