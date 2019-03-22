import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CurrencyBalanceModel} from '../../../../../model/currency-balance.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BalanceService} from '../../../../services/balance.service';
import {select, Store} from '@ngrx/store';
import {getFiatCurrenciesForChoose, State} from 'app/core/reducers';
import {PopupService} from '../../../../../shared/services/popup.service';
import * as _uniq from 'lodash/uniq';
import {RefillResponse} from '../../../../../model/refill-response';
import {RefillData} from '../../../../../shared/interfaces/refill-data-interface';
import {Router} from '@angular/router';

@Component({
  selector: 'app-refill-fiat',
  templateUrl: './refill-fiat.component.html',
  styleUrls: ['./refill-fiat.component.scss']
})
export class RefillFiatComponent implements OnInit, OnDestroy {

  @Input() refillData: any;
  @Output() closePopup = new EventEmitter();
  @ViewChild('simpleMerchant') simpleMerchantTemplate: TemplateRef<any>;
  @ViewChild('listMerchant') listMerchantTemplate: TemplateRef<any>;
  @ViewChild('sendF') sendFTemplate: TemplateRef<any>;
  @ViewChild('redirectionLink') redirectionLink: ElementRef;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public form: FormGroup;
  public submitSuccess = false;
  public isSubmited = false;
  public fiatNames: CurrencyBalanceModel[] = [];
  public defaultFiatNames: CurrencyBalanceModel[] = [];
  public fiatDataByName;
  public selectedMerchant;
  public selectedMerchantNested;
  public amount;
  public merchants;
  public searchTemplate = '';
  public openCurrencyDropdown = false;
  public openPaymentSystemDropdown = false;
  public activeFiat;
  public minRefillSum: number = 0;
  public alphabet;
  public redirectionUrl;
  public selectMerchantName;
  public loading: boolean = false;

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if ($event.target.className !== 'select__value select__value--active'
        && $event.target.className !== 'select__value select__value--active select__value--error'
        && $event.target.className !== 'select__search-input') {
      this.openPaymentSystemDropdown = false;
      this.merchants = this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
        ? this.fiatDataByName.merchantCurrencyData
        : [];
      this.searchTemplate = '';
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    public router: Router,
    private store: Store<State>,
  ) {}

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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleCurrencyDropdown() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
    this.prepareAlphabet();
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    this.merchants = this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
      ? this.fiatDataByName.merchantCurrencyData
      : [];
    this.searchTemplate = '';
    this.openCurrencyDropdown = false;
  }

  selectCurrency(currency) {
    this.isSubmited = false;
    this.activeFiat = currency;
    this.toggleCurrencyDropdown();
    this.getDataByCurrency(currency.name);
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
        this.setMinRefillSum();
      });
  }

  private setMinRefillSum() {
    this.minRefillSum = this.fiatDataByName.minRefillSum > parseFloat(this.selectedMerchant.minSum)
      ? this.fiatDataByName.minRefillSum
      : parseFloat(this.selectedMerchant.minSum);
  }

  selectMerchant(merchant, merchantImage = null) {
    this.selectedMerchantNested = merchantImage;
    this.selectMerchantName =  merchantImage.image_name  || merchant.name;
    this.selectedMerchant = merchant;
    this.form.get('amount').updateValueAndValidity();
    this.togglePaymentSystemDropdown();
    this.setMinRefillSum();
  }

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required, this.minCheck.bind(this)] ),
    });
  }

  submitRefill() {
    this.isSubmited = true;
    if (this.form.valid && this.selectedMerchant.name) {
      this.isSubmited = false;
      this.amount = this.form.controls['amount'].value;
      const data: RefillData = {
        operationType: this.fiatDataByName.payment.operationType,
        currency: this.fiatDataByName.currency.id,
        merchant: this.selectedMerchant.merchantId,
        destination: this.selectedMerchant.description,
        merchantImage: this.selectedMerchantNested.id,
        sum: +this.amount
      };
      this.loading = true;
      this.balanceService.refill(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: RefillResponse) => {
          this.refillData = res;
          this.redirectionUrl = this.refillData.redirectionUrl;
          // this.redirectionUrl = this.getRefillRedirectionUrl(res);
          this.submitSuccess = true;
          setTimeout(() => {
            this.redirectionLink.nativeElement.click();
          }, 1000);
          this.loading = false;
        }, (err) => {
          this.loading = false;
          console.error(err);
        });
    }
  }

  searchMerchant(e) {
    this.searchTemplate = e.target.value;
    this.merchants = this.fiatDataByName.merchantCurrencyData.filter(merchant =>
      !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase())).length
    );
  }

  private minCheck(amount: FormControl) {
      if (this.minRefillSum > amount.value) {
        return {'minThen': true};
      }
      return null;
  }

  hideSend() {
    document.forms['hideForm'].submit();
    return false;
  }

  goToBalances() {
    this.router.navigate(['/funds/balances']);
    this.closePopup.emit(true);
  }

  // getRefillRedirectionUrl(response: RefillResponse): string {
  //   if (response && response.method === 'POST') {
  //     let url = response.redirectionUrl + '?';
  //     for (const key in response.params) {
  //       // console.log('K: ' + key + ' V: ' + response.params[key]);
  //       url += key + '=' + response.params[key] + '&';
  //     }
  //     console.log(url);
  //     return url;
  //   }
  //   if (response && !response.method) {
  //     return response.redirectionUrl;
  //   }
  //   return null;
  // }
}

