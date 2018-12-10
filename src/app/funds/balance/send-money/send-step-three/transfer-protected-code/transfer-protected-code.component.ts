import {Component, OnDestroy, OnInit} from '@angular/core';
import {keys} from '../../../../../core/keys';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as _uniq from 'lodash/uniq';
import {BalanceService} from '../../../../services/balance.service';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-transfer-protected-code',
  templateUrl: './transfer-protected-code.component.html',
  styleUrls: ['./transfer-protected-code.component.scss']
})
export class TransferProtectedCodeComponent implements OnInit, OnDestroy {

  public cryptoNames = [];
  public defaultCryptoNames = [];
  public openCurrencyDropdown = false;
  public recaptchaKey = keys.recaptchaKey;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public activeCrypto;
  public isSubmited = false;
  public activeBalance;
  public isEnterData = true;
  public alphabet;
  public minWithdrawSum = 0.01;
  public responseCommission;
  public isAmountMax;
  public isAmountMin;
  public form: FormGroup;

  responseDefaultCommission = {
    companyCommissionAmount: '0',
    amount: '0',
    totalCommissionAmount: '0',
    companyCommissionRate: '0',
    merchantCommissionRate: `(0%, but not less than 0)`,
    merchantCommissionAmount: '0',
    resultAmount: '0',
    addition: '0'
  };

  public model = {
    operationType: 'USER_TRANSFER',
    currency: 0,
    sum: '',
    pin: '',
    type: 'VOUCHER'
  };

  constructor(
    public balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.responseCommission = this.responseDefaultCommission;
    this.form.controls['amount'].valueChanges
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (!this.isAmountMax && !this.isAmountMin) {
          this.getCommissionInfo(res);
        };
      });

    this.balanceService.getCryptoFiatNames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.defaultCryptoNames = res.data;
        this.cryptoNames = this.defaultCryptoNames;
        this.activeCrypto = this.cryptoNames[0];
        this.prepareAlphabet();
        this.getBalance(this.activeCrypto.name);
        this.getMinSum(this.activeCrypto);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getBalance(name: string) {
    const subscribtion = this.balanceService.getTotalBalance().subscribe(res => {
      const allBalances = res as { sumTotalUSD: any, mapWallets: any };
      const needBalance = allBalances.mapWallets.filter(item => item.currencyName === name);
      this.activeBalance = needBalance[0].activeBalance;
      subscribtion.unsubscribe();
    });
  }

  getCommissionInfo(amount) {
    const subscription = this.balanceService.getCommisionInfo(this.activeCrypto.id, amount, 'VOUCHER')
      .subscribe(res => {
        this.responseCommission = res as any;
        subscription.unsubscribe();
      });
  }

  submitTransfer() {
    this.isSubmited = true;
    if (!this.isAmountMax && !this.isAmountMin && this.form.controls['amount'].value !== '0') {
      this.isSubmited = false;
      this.isEnterData = false;
    }
  }

  selectCurrency(currency) {
    this.form.reset();
    this.isSubmited = false;
    this.responseCommission = this.responseDefaultCommission;
    this.activeCrypto = currency;
    this.getBalance(this.activeCrypto.name);
    this.getMinSum(this.activeCrypto);
    this.currencyDropdownToggle();
  }

  balanceClick() {
    if (this.activeBalance > this.minWithdrawSum) {
      this.form.controls['amount'].setValue(this.activeBalance.toString());
      this.getCommissionInfo(this.activeBalance);
    }
  }

  getMinSum(currency) {
    const subscribtion = this.balanceService.getMinSumInnerTranfer(currency.id.toString(), 'VOUCHER')
      .subscribe((res: {data: string, error: string}) => {
      this.minWithdrawSum = +res.data;
      subscribtion.unsubscribe();
    });
  }

  goToForm() {
    this.isEnterData = true;
  }

  searchCoin(e) {
    this.cryptoNames = this.defaultCryptoNames.filter(f => f.name.toUpperCase().match(e.target.value.toUpperCase()));
    this.prepareAlphabet();
  }

  amountInput(event) {
    this.amountValidator(event.target.value);
  }

  currencyDropdownToggle() {
    this.openCurrencyDropdown = !this.openCurrencyDropdown;
    this.cryptoNames = this.defaultCryptoNames;
    this.prepareAlphabet();
  }

  prepareAlphabet() {
    const temp = [];
    this.cryptoNames.forEach(currency => {
      const letter = currency.name.toUpperCase()[0];
      temp.push(letter);
    });
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    this.alphabet = _uniq(temp.filter(unique).sort());
  }

  afterResolvedCaptcha() {
    this.model.currency = this.activeCrypto.id;
    this.model.sum = this.form.controls['amount'].value;
    const data = {
      operation: 'By private code',
      data: this.model
    };

    this.balanceService.goToPinCode$.next(data);
    this.balanceService.sendPinCode().subscribe(res => {
      // this.balanceService.goToPinCode$.next(data);
    });
  }

  private initForm() {
    this.form = new FormGroup({
      amount: new FormControl('0', {validators: [Validators.required]}),
    });
  }

  amountValidator(sum) {
    this.isAmountMax = +sum >= +this.activeBalance ? true : false;
    this.isAmountMin = +sum <= +this.minWithdrawSum ? true : false;
  }

}
