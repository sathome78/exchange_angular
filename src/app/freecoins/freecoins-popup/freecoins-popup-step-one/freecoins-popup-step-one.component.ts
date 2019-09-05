import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State, getCryptoCurrenciesForChoose } from 'app/core/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CurrencyChoose } from 'app/model/currency-choose.model';
import { UtilsService } from 'app/shared/services/utils.service';
import { BalanceItem } from 'app/funds/models/balance-item.model';
import { FreecoinsService } from 'app/freecoins/freecoins.service';
import { GAFreeCoinsModel } from 'app/freecoins/models/GAFreeCoins.model';

@Component({
  selector: 'app-freecoins-popup-step-one',
  templateUrl: './freecoins-popup-step-one.component.html',
  styleUrls: ['./freecoins-popup-step-one.component.scss'],
  providers: [FreecoinsService],
})
export class FreecoinsPopupStepOneComponent implements OnInit, OnDestroy {
  @Output() submitForm = new EventEmitter<GAFreeCoinsModel>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public form: FormGroup;
  public currencies: CurrencyChoose[] = [];
  public activeCurrency: CurrencyChoose = null;
  public activeBalance = 0;
  public minAmount = 0.00000001;
  public minPrize = 0.00000001;
  public minPeriod = 1;
  public isSubmited = false;
  public inputAmount = null;


  constructor(
    private store: Store<State>,
    private utilsService: UtilsService,
    private freecoinsService: FreecoinsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.store
      .pipe(select(getCryptoCurrenciesForChoose))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currencies => {
        if (currencies.length) {
          this.currencies = currencies;
          this.activeCurrency = currencies[0];
          this.getDataByCurrency(this.activeCurrency);
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', [
        Validators.required,
        this.minAmountCheck.bind(this),
        this.maxAmountCheck.bind(this),
      ]),
      isOneTime: new FormControl(null),
      period: new FormControl('', [Validators.required, this.minPeriodCheck.bind(this)]),
      prize: new FormControl('', [
        Validators.required,
        this.minPrizeCheck.bind(this),
        this.maxPrizeCheck.bind(this),
      ]),
    }, { updateOn: 'change' });
  }

  selectCurrency(currency: CurrencyChoose) {
    this.activeCurrency = currency;
    this.getDataByCurrency(this.activeCurrency);
  }

  getDataByCurrency(activeCurrency) {
    const type = this.utilsService.isFiat(activeCurrency.name) ? 'FIAT' : 'CRYPTO';
    this.freecoinsService
      .getBalanceByName(activeCurrency.id, type)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: BalanceItem) => {
        this.activeBalance = res.activeBalance;
      });
  }

  balanceClick() {
    if (this.activeBalance > this.minAmount) {
      this.formAmount.setValue(this.utilsService.currencyFormat(this.activeBalance));
      this.inputAmount = this.activeBalance;
      this.formAmount.markAsTouched();
    }
  }

  onSubmit() {
    const data = new GAFreeCoinsModel(
      this.activeCurrency.name,
      this.formAmount.value,
      this.formOneTime.value,
      this.formPeriod.value,
      this.formPrize.value
    );
    this.submitForm.emit(data);
  }

  onInputAmount(e) {
    this.inputAmount = e.target.value;
  }

  onCheckeOneTime(e) {
    if (e.target.checked) {
      this.formPeriod.setValidators([]);
      this.formPeriod.reset();
      this.formPeriod.disable();
    } else {
      this.formPeriod.setValidators([Validators.required, this.minPeriodCheck.bind(this)]);
      this.formPeriod.enable();
    }
  }

  // form getters
  get formAmount() {
    return this.form.controls['amount'];
  }
  get formOneTime() {
    return this.form.controls['isOneTime'];
  }
  get formPeriod() {
    return this.form.controls['period'];
  }
  get formPrize() {
    return this.form.controls['prize'];
  }

  // validators
  private minAmountCheck(control: FormControl) {
    if (this.minAmount > (+control.value ? +control.value : 0)) {
      return { minAmount: true };
    }
    return null;
  }
  private maxAmountCheck(control: FormControl) {
    if (+this.activeBalance < (+control.value ? +control.value : 0)) {
      return { maxAmount: true };
    }
    return null;
  }
  private minPeriodCheck(control: FormControl) {
    if (+this.minPeriod > (+control.value ? +control.value : 0)) {
      return { minPeriod: true };
    }
    return null;
  }
  private minPrizeCheck(control: FormControl) {
    if (+this.minPrize > (+control.value ? +control.value : 0)) {
      return { minPrize: true };
    }
    return null;
  }
  private maxPrizeCheck(control: FormControl) {
    if ((this.inputAmount || 0) < (+control.value ? +control.value : 0)) {
      return { maxPrize: true };
    }
    return null;
  }

  // getters
  get totalQtyOfPrizes(): number {
    if (this.formAmount.value && this.formPrize.value) {
      return Math.floor(this.formAmount.value / this.formPrize.value);
    }
    return 0;
  }

}