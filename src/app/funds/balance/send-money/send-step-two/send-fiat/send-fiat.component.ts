import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { CurrencyBalanceModel } from 'app/model';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BalanceService } from '../../../../services/balance.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { keys } from '../../../../../shared/constants';
import { getFiatCurrenciesForChoose, getUserInfo, State } from 'app/core/reducers';
import { select, Store } from '@ngrx/store';
import { SEND_FIAT } from '../../send-money-constants';
import { CommissionData } from '../../../../models/commission-data.model';
import { defaultCommissionData } from '../../../../store/reducers/default-values';
import { PopupService } from 'app/shared/services/popup.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { FUG } from 'app/funds/balance/balance-constants';

@Component({
  selector: 'app-send-fiat',
  templateUrl: './send-fiat.component.html',
  styleUrls: ['./send-fiat.component.scss'],
})
export class SendFiatComponent implements OnInit, OnDestroy {
  @Input() balanceData;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fiatNames: CurrencyBalanceModel[] = [];
  public recaptchaKey = keys.recaptchaKey;
  public openCurrencyDropdown = false;
  public openPaymentSystemDropdown = false;
  public fiatInfoByName;
  public minWithdrawSum = 0;
  public merchants;
  public amountValue = 0;
  public isEnterData = true;
  public activeBalance = 0;
  public isSubmited = false;
  public selectedMerchant;
  public activeFiat;
  public form: FormGroup;
  public searchTemplate = '';
  public selectMerchantName;
  public selectedMerchantNested;
  public calculateData: CommissionData = defaultCommissionData;
  public userInfo: ParsedToken;
  public FUG = FUG;

  public model = {
    currency: 0,
    merchant: 0,
    sum: '',
    currencyName: '',
    destination: '',
    destinationTag: '',
    merchantImage: '',
    securityCode: '',
  };

  /** Are listening click in document */
  @HostListener('document:click', ['$event']) clickout($event) {
    if (
      $event.target.className !== 'select__value select__value--active' &&
      $event.target.className !== 'select__search-input'
    ) {
      this.openCurrencyDropdown = false;
      this.openPaymentSystemDropdown = false;
    }
  }

  constructor(
    public balanceService: BalanceService,
    public popupService: PopupService,
    public utilsService: UtilsService,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.initForm();

    this.store
      .pipe(select(getFiatCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        this.fiatNames = currencies;
        this.activeFiat = this.fiatNames[0];
        this.setActiveFiat();
        if (this.activeFiat) {
          this.getFiatInfoByName(this.activeFiat.name);
          this.getBalance(this.activeFiat.name);
        }
      });
    if (this.selectMerchantName === FUG) {
      this.form.removeControl('address');
    }

    this.store
      .pipe(select(getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setActiveFiat() {
    let currency;
    if (this.balanceData && this.balanceData.currencyId) {
      currency = this.fiatNames.filter(item => +item.id === +this.balanceData.currencyId);
    }
    this.activeFiat = currency && currency.length ? currency[0] : this.fiatNames[0];
  }

  selectCurrency(currency) {
    this.form.reset();
    this.activeFiat = currency;
    this.currencyDropdownToggle();
    this.getFiatInfoByName(this.activeFiat.name);
    this.getBalance(this.activeFiat.name);
  }

  selectMerchant(merchant, merchantImage = null) {
    this.selectedMerchantNested = merchantImage;
    this.selectMerchantName = merchantImage.image_name || merchant.name;
    this.selectedMerchant = merchant;
    this.setMinWithdrawSum();
    this.calculateData.commission_rates_sum = this.selectedMerchant.outputCommission;
    this.calculateCommission(this.amountValue);
    if (merchant.name === FUG) {
      this.form.removeControl('address');
    } else {
      this.form.addControl('address', this.form);
    }
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.openPaymentSystemDropdown = false;
  }

  balanceClick() {
    if (this.activeBalance > this.minWithdrawSum) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.calculateCommission(this.activeBalance);
      this.amountValue = this.activeBalance;
    }
  }

  togglePaymentSystemDropdown() {
    this.openPaymentSystemDropdown = !this.openPaymentSystemDropdown;
    // FUG BLOCK
    // this.merchants =
    //   this.fiatInfoByName && this.fiatInfoByName.merchantCurrencyData
    //     ? this.fiatInfoByName.merchantCurrencyData.filter(item => item.name !== FUG)
    //     : [];
    this.merchants =
      this.fiatInfoByName && this.fiatInfoByName.merchantCurrencyData
        ? this.fiatInfoByName.merchantCurrencyData
        : [];
    this.searchTemplate = '';
    this.openCurrencyDropdown = false;
  }

  onSubmitWithdrawal() {
    this.isSubmited = true;
    this.form.get('amount').updateValueAndValidity();
    if (this.form.valid && this.selectedMerchant.name) {
      this.isSubmited = false;
      this.isEnterData = false;
    }
  }

  getBalance(name: string) {
    this.balanceService
      .getTotalBalance()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const allBalances = res as { sumTotalUSD: any; mapWallets: any };
        const needBalance = allBalances.mapWallets.filter(item => item.currencyName === name);
        this.activeBalance = needBalance[0].activeBalance;
      });
  }

  private getFiatInfoByName(name: string) {
    this.calculateData = defaultCommissionData;
    this.balanceService
      .getCurrencyData(name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.fiatInfoByName = res;
        this.merchants = this.fiatInfoByName.merchantCurrencyData;
        // FUG BLOCK
        // this.merchants = this.fiatInfoByName.merchantCurrencyData.filter(item => item.name !== FUG);

        this.selectedMerchant = this.merchants.length ? this.merchants[0] : null;
        this.selectedMerchantNested = this.selectedMerchant ? this.selectedMerchant.listMerchantImage[0] : null;
        this.selectMerchantName = this.selectedMerchantNested ? this.selectedMerchantNested.image_name : '';
        if (this.selectedMerchant) {
          this.calculateData.commission_rates_sum = this.selectedMerchant.outputCommission;
          this.calculateCommission(0);
          this.setMinWithdrawSum();
        }
        if (this.selectMerchantName === FUG) {
          this.form.removeControl('address');
        }
      });
  }

  private setMinWithdrawSum() {
    this.minWithdrawSum =
      this.fiatInfoByName.minWithdrawSum > parseFloat(this.selectedMerchant.minSum)
        ? this.fiatInfoByName.minWithdrawSum
        : parseFloat(this.selectedMerchant.minSum);
    this.form.controls['amount'].updateValueAndValidity();
  }

  calculateCommission(amount) {
    if (this.form.controls['amount'].valid && this.selectedMerchant.merchantId) {
      this.balanceService
        .getCommissionToWithdraw(amount, this.activeFiat.id, this.selectedMerchant.merchantId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.calculateData = res as CommissionData;
          const compCommission = parseFloat(
            this.calculateData.companyCommissionRate.replace('%)', '').replace('(', '')
          );
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

  afterResolvedCaptcha(event) {
    if (this.selectedMerchant.name) {
      this.model.currency = this.selectedMerchant.currencyId;
      this.model.merchant = this.selectedMerchant.merchantId;
      this.model.merchantImage = this.selectedMerchantNested.id;
      this.model.currencyName = this.activeFiat.name || '';
      this.model.sum = this.form.controls['amount'].value;
      if (this.selectedMerchant.name !== FUG) {
        this.model.destination = this.form.controls['address'].value;
      }

      const data = {
        operation: SEND_FIAT,
        data: this.model,
      };

      this.balanceService.goToPinCode$.next(data);
    }
  }

  searchMerchant(e) {
    this.searchTemplate = e.target.value;
    // FUG BLOCK
    // this.merchants = this.fiatInfoByName.merchantCurrencyData.filter(item => item.name !== FUG).filter(
    //   merchant =>
    //     !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase()))
    //       .length
    // );
    this.merchants = this.fiatInfoByName.merchantCurrencyData.filter(
      merchant =>
        !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase()))
          .length
    );
    // this.merchants = this.fiatInfoByName.merchantCurrencyData.filter(
    //   merchant =>
    //     !!merchant.listMerchantImage.filter(f2 => f2.image_name.toUpperCase().match(e.target.value.toUpperCase()))
    //       .length
    // );
  }

  goToWithdrawal() {
    this.isEnterData = true;
  }

  private initForm() {
    this.form = new FormGroup({
      address: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        this.isMaxThenActiveBalance.bind(this),
        this.isMinThenMinWithdraw.bind(this),
      ]),
    });
  }

  isMaxThenActiveBalance(): { [key: string]: any } | null {
    if (+this.activeBalance < +this.amountValue) {
      return { isMaxThenActiveBalance: true };
    }
    return null;
  }

  isMinThenMinWithdraw(): { [key: string]: any } | null {
    if (+this.minWithdrawSum > +this.amountValue) {
      return { isMinThenMinWithdraw: true };
    }
    return null;
  }

  get currName() {
    return this.activeFiat ? this.activeFiat.name : '';
  }

  trackByFiatNames(index, item) {
    return item.id;
  }

  trackByIndex(index, item) {
    return index;
  }
}
