import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as jspdf from 'jspdf';
import * as _uniq from 'lodash/uniq';
import html2canvas from 'html2canvas';
import { CurrencyBalanceModel } from 'app/model';
import { select, Store } from '@ngrx/store';
import { getFiatCurrenciesForChoose, State } from 'app/core/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BalanceService } from 'app/funds/services/balance.service';
import { CommissionData } from 'app/funds/models/commission-data.model';
import { defaultCommissionData } from 'app/funds/store/reducers/default-values';


@Component({
  selector: 'app-step-one-deposit',
  templateUrl: './step-one-deposit.component.html',
  styleUrls: ['./step-one-deposit.component.scss']
})
export class StepOneDepositComponent implements OnInit {

  constructor(
    private store: Store<State>,
    public balanceService: BalanceService,) { }
  
  @Input() quberaBank: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public defaultFiatNames: CurrencyBalanceModel[] = [];
  public openPaymentSystemDropdown = false;
  public openCurrencyDropdown = false;
  public fiatDataByName;
  public selectedMerchant;
  public selectMerchantName;
  public selectedMerchantNested;
  public minRefillSum: number = 0;
  public amountValue: number = 0;
  public activeBalance: number = 0;
  public minWithdrawSum: number = 0;
  public merchants;
  public searchTemplate = '';
  public activeFiat;
  public alphabet;
  public calculateData: CommissionData = defaultCommissionData;
  form: FormGroup;
  @ViewChild('content') content: ElementRef;

  ngOnInit() {
    this.initForm();
    this.merchants = this.quberaBank.balance.merchantCurrencyData;

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

  selectCurrency(currency) {
    this.activeFiat = currency;
    this.toggleCurrencyDropdown();
    this.getDataByCurrency(currency.name);
  }

  selectMerchant(merchant, merchantImage = null) {
    this.selectedMerchantNested = merchantImage;
    this.selectMerchantName =  merchantImage.image_name  || merchant.name;
    this.selectedMerchant = merchant;
    this.form.get('amount').updateValueAndValidity();
    this.togglePaymentSystemDropdown();
    this.setMinRefillSum();
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    this.merchants = this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
      ? this.fiatDataByName.merchantCurrencyData
      : [];
    this.searchTemplate = '';
    this.openCurrencyDropdown = false;
  }

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('')
    });
  }

  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active'
        && $event.target.className !== 'select__value select__value--active select__value--error'
        && $event.target.className !== 'select__search-input') {
      this.openPaymentSystemDropdown = false;
      this.merchants = this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
        ? this.fiatDataByName.merchantCurrencyData
        : [];
      this.openCurrencyDropdown = false;
    }
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

  private setMinRefillSum() {
    this.minRefillSum = this.fiatDataByName.minRefillSum > parseFloat(this.selectedMerchant.minSum)
      ? this.fiatDataByName.minRefillSum
      : parseFloat(this.selectedMerchant.minSum);
      console.log(this.minRefillSum);
  }

  searchMerchant(e) {
    this.searchTemplate = e.target.value;
    this.merchants = this.fiatDataByName.merchantCurrencyData.filter(merchant =>
      !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase())).length
    );
  }

  amountBlur(event) {
    if (event && this.form.controls['amount'].valid) this.calculateCommission(this.amountValue);
  }

  amountInput(event) {
    this.amountValue = event.target.value;
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

  calculateCommission(amount) {
    if (this.form.controls['amount'].valid && this.selectedMerchant.merchantId) {
      this.balanceService
        .getCommissionToWithdraw(amount, this.activeFiat.id, this.selectedMerchant.merchantId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.calculateData = res as CommissionData;
          const compCommission = parseFloat(this.calculateData.companyCommissionRate.replace('%)', '').replace('(', ''));
          this.calculateData.commission_rates_sum = +this.selectedMerchant.outputCommission + (Number.isNaN(compCommission) ? compCommission : 0);
          console.log(this.calculateData);
        });
    } else {
      const outCommission = !!this.selectedMerchant ? this.selectedMerchant.outputCommission : 0;
      const fixCommission = !!this.selectedMerchant ? this.selectedMerchant.fixedMinCommission : 0;
      this.calculateData.merchantCommissionRate = `(${outCommission}%, but not less than ${fixCommission} USD)`;
      console.log(this.calculateData);
    }
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
    this.activeFiat = (currency && currency.length) ? currency[0] : this.fiatNames[0];
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

  download() { 
    let data = document.getElementById('pdf-download');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('kp.pdf'); // Generated PDF
    });

  }

}
