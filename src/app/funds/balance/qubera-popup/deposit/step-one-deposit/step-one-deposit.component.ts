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


@Component({
  selector: 'app-step-one-deposit',
  templateUrl: './step-one-deposit.component.html',
  styleUrls: ['./step-one-deposit.component.scss']
})
export class StepOneDepositComponent implements OnInit {

  constructor(
    private store: Store<State>,
    public balanceService: BalanceService,) { }
  
  @Input() refillData: any;
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

  form: FormGroup;
  @ViewChild('content') content: ElementRef;

  ngOnInit() {
    this.initForm();

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

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('')
    });
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
  }

  
  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openBankSystemDropdown = false;
    this.prepareAlphabet();
  }

  
  
  bankDropdownToggle() {
    this.openBankSystemDropdown = !this.openBankSystemDropdown;
    this.openCurrencyDropdown = false;
  }

  

  setActiveFiat() {
    let currency;
    if (this.refillData && this.refillData.currencyId) {
      currency = this.fiatNames.filter(item => +item.id === +this.refillData.currencyId);
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
