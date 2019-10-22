import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { CurrencyBalanceModel } from '../../../../../model/currency-balance.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../../../services/balance.service';
import { select, Store } from '@ngrx/store';
import { getFiatCurrenciesForChoose, State } from 'app/core/reducers';
import { PopupService } from '../../../../../shared/services/popup.service';
import * as _uniq from 'lodash/uniq';
import { RefillData } from '../../../../../shared/interfaces/refill-data-interface';
import { Router } from '@angular/router';
import { FUG, EUR } from 'app/funds/balance/balance-constants';
import { UtilsService } from 'app/shared/services/utils.service';
import { QiwiRefill } from 'app/model/qiwi-rifill-response.model';
import { COPY_ADDRESS } from '../../../send-money/send-money-constants';

@Component({
  selector: 'app-refill-fiat',
  templateUrl: './refill-fiat.component.html',
  styleUrls: ['./refill-fiat.component.scss'],
})
export class RefillFiatComponent implements OnInit, OnDestroy {
  @Input() refillData: any;
  @Output() closePopup = new EventEmitter();
  @Output() goToThirdStep = new EventEmitter();
  @Output() selectQuberaBank = new EventEmitter();
  @Output() hideSteps = new EventEmitter();
  @ViewChild('simpleMerchant') simpleMerchantTemplate: TemplateRef<any>;
  @ViewChild('listMerchant') listMerchantTemplate: TemplateRef<any>;
  @ViewChild('sendF') sendFTemplate: TemplateRef<any>;
  @ViewChild('redirectionLink') redirectionLink: ElementRef;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public form: FormGroup;
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
  public minRefillSum = 0;
  public alphabet;
  public redirectionUrl;
  public selectMerchantName;
  public loading = false;
  public qiwiResData: QiwiRefill;
  public isShowCopyAddress = false;
  public isShowCopyMemoId = false;

  public viewsList = {
    LOADING: 'loading',
    SUCCESS: 'success',
    MAIN: 'main',
    DENIED: 'denied',
  };

  public VIEW = this.viewsList.LOADING;

  /** Are listening click in document */
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
      this.searchTemplate = '';
      this.openCurrencyDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    public utilsService: UtilsService,
    public router: Router,
    private store: Store<State>
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
        if (this.activeFiat) {
          this.getDataByCurrency(this.activeFiat.name);
        }
        this.prepareAlphabet();
      });
  }

  setActiveFiat() {
    let currency;
    if (this.refillData && this.refillData.currencyId) {
      currency = this.fiatNames.filter(item => +item.id === +this.refillData.currencyId);
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
    // FUG BLOCK
    this.merchants =
      this.fiatDataByName && this.fiatDataByName.merchantCurrencyData
        ? this.fiatDataByName.merchantCurrencyData.filter(i => this.utilsService.filterMerchants(i))
        : [];
    this.searchTemplate = '';
    this.openCurrencyDropdown = false;
  }

  selectCurrency(currency) {
    this.isSubmited = false;
    this.activeFiat = currency;
    this.toggleCurrencyDropdown();
    this.getDataByCurrency(currency.name);
    this.form.updateValueAndValidity();
  }

  private getDataByCurrency(currencyName) {
    this.balanceService
      .getCurrencyRefillData(currencyName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatDataByName = res;
        // FUG BLOCK
        this.merchants = this.fiatDataByName.merchantCurrencyData.filter(i => this.utilsService.filterMerchants(i));
        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
        this.selectedMerchantNested = this.selectedMerchant ? this.selectedMerchant.listMerchantImage[0] : null;
        this.selectMerchantName = this.selectedMerchantNested ? this.selectedMerchantNested.image_name : '';
        if (this.isQIWI) {
          this.formAmout.setValidators([]);
        } else {
          this.formAmout.setValidators([Validators.required, this.minCheck.bind(this)]);
        }
        this.formAmout.updateValueAndValidity();
        if (this.selectedMerchant) {
          this.setMinRefillSum();
        }
        this.setView(this.viewsList.MAIN);
      }, err => {
        if (err.error && err.error.title === 'USER_OPERATION_DENIED') {
          this.setView(this.viewsList.DENIED);
        } else {
          this.setView(this.viewsList.MAIN);
        }
      });
  }

  private setMinRefillSum() {
    this.minRefillSum =
      this.fiatDataByName.minRefillSum > parseFloat(this.selectedMerchant.minSum)
        ? this.fiatDataByName.minRefillSum
        : parseFloat(this.selectedMerchant.minSum);
  }

  selectMerchant(merchant, merchantImage = null) {
    if (merchant.name === FUG) {
      this.selectQuberaBank.emit(true);
    } else {
      this.hideSteps.emit(true);
    }
    this.selectedMerchantNested = merchantImage;
    this.selectMerchantName = merchantImage.image_name || merchant.name;
    this.selectedMerchant = merchant;
    if (this.isQIWI) {
      this.formAmout.setValidators([]);
    } else {
      this.formAmout.setValidators([Validators.required, this.minCheck.bind(this)]);
    }
    this.togglePaymentSystemDropdown();
    this.setMinRefillSum();
    this.formAmout.updateValueAndValidity();
  }

  initForm() {
    this.form = new FormGroup(
      {
        amount: new FormControl('', [Validators.required, this.minCheck.bind(this)]),
      },
      { updateOn: 'change' }
    );
  }

  refillQubera() {
    const deposit: Object = { currencyName: this.activeFiat.name, amount: this.form.controls.amount.value };
    const obj: Object = {
      currency: this.selectedMerchant.currencyId,
      merchant: this.selectedMerchant.merchantId,
      destination: '',
      merchantImage: 1108,
      sum: `${this.form.controls.amount.value}`,
      destinationTag: '',
      operationType: 'INPUT',
    };
    this.balanceService
      .fiatDepositQubera(deposit)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.balanceService.setRefillTransfer(obj);
          this.goToThirdStep.emit(true);
        },
        error => {
          console.error(error);
        }
      );
  }

  refillMerchant() {
    this.isSubmited = false;
    if (this.isQIWI) {
      this.qiwiResData = {
        address: this.selectedMerchant.mainAddress,
        memo: this.selectedMerchant.address,
        additionalFieldName: this.selectedMerchant.additionalFieldName,
        paymentLink: this.selectedMerchant.paymentLink,
      };
      if (this.selectedMerchant.address && this.selectedMerchant.paymentLink) {
        this.setView(this.viewsList.SUCCESS);
        this.loading = false;
        return;
      }
    }

    this.amount = this.formAmout.value;
    const data: RefillData = {
      operationType: this.fiatDataByName.payment.operationType,
      currency: this.fiatDataByName.currency.id,
      merchant: this.selectedMerchant.merchantId,
      destination: this.selectedMerchant.description,
      merchantImage: this.selectedMerchantNested.id,
      sum: +this.amount || (this.isQIWI ? 0 : null),
    };
    if (this.isQIWI) {
      data.generateNewAddress = true;
    }
    this.loading = true;
    this.balanceService
      .refill(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res: any) => {
          if (this.isQIWI) {
            this.qiwiResData = { ...this.qiwiResData, memo: res.params.address, paymentLink: res.params.paymentLink };
            this.setView(this.viewsList.SUCCESS);
            this.loading = false;
            return;
          }
          this.refillData = res;
          this.redirectionUrl = this.refillData.redirectionUrl;
          if (!this.isCoinPay) {
            setTimeout(() => {
              this.redirectionLink.nativeElement.click();
            }, 1000);
          }
          this.setView(this.viewsList.SUCCESS);
          this.loading = false;
        },
        err => {
          this.loading = false;
          console.error(err);
        }
      );
  }

  submitRefill() {
    this.isSubmited = true;
    if (this.selectedMerchant.name === FUG && this.activeFiat.name === EUR) {
      this.refillQubera();
    } else {
      if (this.form.valid && this.selectedMerchant.name) {
        this.refillMerchant();
      }
    }
  }

  searchMerchant(e) {
    this.searchTemplate = e.target.value;
    // FUG BLOCK
    this.merchants = this.fiatDataByName.merchantCurrencyData
      .filter(i => this.utilsService.filterMerchants(i))
      .filter(
        merchant =>
          !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase()))
            .length
      );
  }

  private minCheck(amount: FormControl) {
    if (this.minRefillSum > (!!amount.value ? amount.value : 0)) {
      return { minThen: true };
    }
    return null;
  }

  hideSend() {
    if (this.isCoinPay) {
      return;
    }
    document.forms['hideForm'].submit();
    return false;
  }

  goToBalances() {
    this.router.navigate(['/funds/balances?tab=pr']);
    this.closePopup.emit(true);
  }

  trackByFiatNames(index, item) {
    return item.id;
  }

  trackByIndex(index) {
    return index;
  }

  /**
   * copy data to buffer
   * @param {string} val
   * @param {string} btn
   */
  copyToBuffer(val: string, btn: string) {
    this.changeCopyBtn(btn);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  private changeCopyBtn(name: string) {
    switch (name) {
      case COPY_ADDRESS:
        this.isShowCopyAddress = true;
        setTimeout(() => (this.isShowCopyAddress = false), 1000);
        break;
      case 'Copy id':
        this.isShowCopyMemoId = true;
        setTimeout(() => (this.isShowCopyMemoId = false), 1000);
        break;
    }
  }

  get isQIWI(): boolean {
    return this.selectedMerchant && this.selectedMerchant.name === 'QIWI';
  }
  get isRefillClosed(): boolean {
    return !this.merchants.length;
  }
  get isNeedKyc(): boolean {
    return this.selectedMerchant && this.selectedMerchant.needKycRefill;
  }
  get isCoinPay(): boolean {
    return this.selectedMerchant && this.selectedMerchant.name === 'CoinPay(Privat24)';
  }
  get formAmout() {
    return this.form.controls['amount'];
  }
  get currName() {
    return this.activeFiat && this.activeFiat.name;
  }
  private setView(v) {
    this.VIEW = v;
  }
}
