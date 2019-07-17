import { Component, OnInit, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getFiatCurrenciesForChoose, State } from 'app/core/reducers';
import { takeUntil, switchMap, first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _uniq from 'lodash/uniq';
import * as _ from 'lodash';
import { CurrencyBalanceModel } from 'app/model';
import { BalanceService } from 'app/funds/services/balance.service';
import { Sepa } from 'app/funds/models/sepa.model';
import { Swift } from 'app/funds/models/swift.model';
import { KycCountry } from 'app/shared/interfaces/kyc-country-interface';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'app-step-one-withdraw',
  templateUrl: './step-one-withdraw.component.html',
  styleUrls: ['./step-one-withdraw.component.scss']
})
export class StepOneWithdrawComponent implements OnInit {
  form: FormGroup;
  formSepa: FormGroup;
  formSwift: FormGroup;

  @Input() dataQubera: any;
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public defaultFiatNames: CurrencyBalanceModel[] = [];
  public openBankSystemDropdown = false;
  public openCurrencyDropdown = false;
  public searchTemplate: string = '';
  public fiatDataByName;
  public fiatArrayData;
  public selectedMerchant;
  public selectMerchantName;
  public selectedMerchantNested;
  public minRefillSum: number = 0;
  public merchants;
  public activeFiat;
  public alphabet;


  // country
  
  public openCountryDropdown: Boolean = false;
  public showCountryLabelFlag: Boolean = false;
  public selectedCountry;
  public countryArray: KycCountry[] = [];
  public countryArrayDefault: KycCountry[] = [];
  @ViewChild('countryInput') countryInput: ElementRef;

  radioItems: Array<string>;
  model: string = '';

  constructor(
    private store: Store<State>,
    private settingsService: SettingsService,
    public balanceService: BalanceService) {
      this.radioItems = ['sepa', 'swift'];
      this.model = 'sepa';
    }

  checkForm(value) {
    this.model = value;
    if(this.model == 'sepa') {
      this.initSepaForm();
    } else if(this.model == 'swift') {
      this.initSwiftForm();
    }
  }

  ngOnInit() {
    this.initMainForm();

    this.initSepaForm();
    this.getCountryCode();

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultFiatNames = currencies;
        // this.fiatNames = this.defaultFiatNames;
        this.fiatNames.push(this.defaultFiatNames[2]);
        this.setActiveFiat();
        if (this.activeFiat) this.getDataByCurrency(this.activeFiat.name);
        this.prepareAlphabet();
      });
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
        this.fiatDataByName = _.filter(this.fiatArrayData.merchantCurrencyData, function(item){
          return item.name == 'Qubera';
        });
        // this.merchants = this.fiatDataByName.merchantCurrencyData;
        this.merchants = this.fiatDataByName;
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
        this.selectedMerchantNested = this.selectedMerchant ? this.selectedMerchant.listMerchantImage[0] : null;
        this.selectMerchantName = this.selectedMerchantNested ? this.selectedMerchantNested.image_name : '';
        this.form.get('amount').updateValueAndValidity();
        if (this.selectedMerchant) this.setMinRefillSum();
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

  selectMerchant(bank: any) {
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

  bankDropdownToggle() {
    this.openBankSystemDropdown = !this.openBankSystemDropdown;
    this.openCurrencyDropdown = false;
    this.openCountryDropdown = false;
  }


  

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

  


  initMainForm() {
    this.form = new FormGroup({
      amount: new FormControl('', Validators.required)
    })
  }

  initSwiftForm() {
    this.formSwift = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
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
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
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

  submit(form, secform) {
    // console.log(this.activeFiat);
    // console.log(form);
    // console.log(secform);
    if(form.valid && secform.valid) {
      let obj;
      if(this.model == 'sepa') {
        const withdraw = new Sepa();
        withdraw.amount = `${form.value.amount}`;
        withdraw.currencyCode = `${this.activeFiat.name}`;
        withdraw.firstName = secform.value.firstName;
        withdraw.lastName = secform.value.lastName;
        withdraw.companyName = secform.value.companyName;
        withdraw.narrative = secform.value.narrative;
        withdraw.iban = secform.value.iban;
        withdraw.type = "sepa";
        obj = withdraw;
      } else if(this.model == 'swift') {
        const withdraw = new Swift();
        withdraw.amount = `${form.value.amount}`;
        withdraw.currencyCode = `${this.activeFiat.name}`;
        withdraw.firstName = secform.value.firstName;
        withdraw.lastName = secform.value.lastName;
        withdraw.companyName = secform.value.companyName;
        withdraw.accountNumber = secform.value.accountNumber;
        withdraw.swift = secform.value.swift;
        withdraw.narrative = secform.value.narrative;
        withdraw.type = "swift";
        withdraw.address = secform.value.address;
        withdraw.city = secform.value.city;
        withdraw.countryCode = this.selectedCountry.countryCode;
        obj = withdraw;
      }
      console.log(obj);
      // this.balanceService.sendWithdraw(obj)
      //   .pipe(first())
      //   .subscribe(data => {
      //     console.log(data);
      //     this.nextStep.emit(2);
      //   });
        this.nextStep.emit(2);
    }

      
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
  showCountryLabel(flag: boolean) {
    this.showCountryLabelFlag = flag;
  }

  selectCountry(country) {
    this.selectedCountry = country;
    this.countryDropdownToggle();
    this.formSwift.controls.countryCode.setValue(country.countryCode);
  }
  
  searchCountry(e) {
    this.countryArray = this.countryArrayDefault.filter(f => f.countryName.toUpperCase().match(e.target.value.toUpperCase()));
  }

}
