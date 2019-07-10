import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getFiatCurrenciesForChoose, State } from 'app/core/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _uniq from 'lodash/uniq';
import { CurrencyBalanceModel } from 'app/model';
import { BalanceService } from 'app/funds/services/balance.service';

@Component({
  selector: 'app-step-one-withdraw',
  templateUrl: './step-one-withdraw.component.html',
  styleUrls: ['./step-one-withdraw.component.scss']
})
export class StepOneWithdrawComponent implements OnInit {
  form: FormGroup;
  @Input() dataQubera: any;
  @Output() public nextStep: EventEmitter<any> = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public defaultFiatNames: CurrencyBalanceModel[] = [];
  public openBankSystemDropdown = false;
  public openCurrencyDropdown = false;
  public fiatDataByName;
  public selectedMerchant;
  public selectMerchantName;
  public selectedMerchantNested;
  public minRefillSum: number = 0;
  public merchants;
  public activeFiat;
  public alphabet;

  public banks = [
    {name: "Qubera bak"}
  ];

  public selectedBank = this.banks[0].name;

  constructor(
    private store: Store<State>,
    public balanceService: BalanceService) { }

  ngOnInit() {
    this.initForm();
    console.log(this.dataQubera);

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.defaultFiatNames = currencies;
        this.fiatNames = this.defaultFiatNames;
        this.setActiveFiat();
        if (this.activeFiat) this.getDataByCurrency(this.activeFiat.name);
        this.prepareAlphabet();
      });
  }

  setActiveFiat() {
    let currency;
    console.log(this.dataQubera.balance);
    if (this.dataQubera.balance && this.dataQubera.balance.currenciesId[0]) {
      currency = this.fiatNames.filter(item => +item.id === +this.dataQubera.balance.currenciesId[0]);
    }
    this.activeFiat = (currency && currency.length) ? currency[0] : this.fiatNames[0];
  }

  private getDataByCurrency(currencyName) {
    this.balanceService.getCurrencyRefillData(currencyName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatDataByName = res;
        this.merchants = this.fiatDataByName.merchantCurrencyData;
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
        this.selectedMerchantNested = this.selectedMerchant ? this.selectedMerchant.listMerchantImage[0] : null;
        this.selectMerchantName = this.selectedMerchantNested ? this.selectedMerchantNested.image_name : '';
        this.form.get('amount').updateValueAndValidity();
        if (this.selectedMerchant) this.setMinRefillSum();
      });
  }

  selectCurrency(currency) {
    this.activeFiat = currency;
    this.toggleCurrencyDropdown();
    this.getDataByCurrency(currency.name);
  }

  chooseBank(bank: any) {
    console.log(bank);
  }

  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openBankSystemDropdown = false;
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
  }


  

  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active'
        && $event.target.className !== 'select__value select__value--active select__value--error'
        && $event.target.className !== 'select__search-input') {
      this.openBankSystemDropdown = false;
      this.merchants = this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
        ? this.fiatDataByName.merchantCurrencyData
        : [];
      this.openCurrencyDropdown = false;
    }
  }


  initForm() {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      bankaddress: new FormControl('', Validators.required),
      bankcountrycode: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      swift: new FormControl('', Validators.required),
      ibal: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required),
      zipCode: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required)
    })
  }

  submit(form) {
    console.log(form.value.valid);
    console.log(this.activeFiat);
    console.log(form);
    if(form.valid) {
      this.nextStep.emit(2);
    }
  }

}
