import {Component, Input, OnInit, Output, EventEmitter, OnChanges, ViewChild, ElementRef} from '@angular/core';
import {IEOItem} from 'app/model/ieo.model';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserService} from 'app/shared/services/user.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { RoundCurrencyPipe } from 'app/shared/pipes/round-currency.pipe';
import { FormatCurrencyPipe } from 'app/shared/pipes/format-currency.pipe';

@Component({
  selector: 'app-popup-buy',
  templateUrl: './popup-buy.component.html',
  styleUrls: ['./popup-buy.component.scss']
})
export class PopupBuyComponent implements OnInit, OnChanges {

  public form: FormGroup;
  @ViewChild('input') input: ElementRef;
  @Input() IEOData: IEOItem;
  public userBalanceBTC: number;
  public userBalanceCoin: number;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  public minSum: number = 0;
  public maxSumValidate: number= 1;
  public maxSumShow: string = '';
  public pay: number = 0;
  public loading: boolean = true;
  public prevValue;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private roundCurrency: RoundCurrencyPipe,
    private formatCurrency: FormatCurrencyPipe,
  ) { }

  ngOnInit() {
    this.initForm();
    this.userService.getUserBalanceCurr(['BTC', this.IEOData.currencyName])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.userBalanceBTC = res.data['BTC'];
        this.userBalanceCoin = res.data[this.IEOData.currencyName];
        this.getMaxAvailSum();
        this.loading = false;
      })
  }

  ngOnChanges(c) {
    if(c.IEOData && c.IEOData.currentValue) {
      this.minSum = c.IEOData.currentValue.minAmount
    }
    if(c.show && c.show.currentValue) {
      this.form.reset();
    }
  }

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required, this.minCheck.bind(this), this.maxCheck.bind(this)]),
    },);

    // this.amountInput.valueChanges
    //   .pipe(takeUntil(this.ngUnsubscribe$))
    //   .subscribe((val) => {
    //     if(val !== this.prevValue) {
    //       this.onInput(val);
    //     }
    //   })
  }

  private minCheck(amount: FormControl) {
    if (this.minSum > (!!amount.value ? amount.value : 0)) {
      return {'minThen': true};
    }
    return null;
  }

  private maxCheck(amount: FormControl) {
    if (this.maxSumValidate < (!!amount.value ? +amount.value : 0)) {
      return {'maxThen': true};
    }
    return null;
  }

  private countPay(amount) {
    this.pay = this.IEOData.rate * amount;
  }

  closeMe() {
    this.close.emit();
  }

  onBlur(e) {
    if(e) {
      console.log(e.target.value);
      const value = parseFloat(this.deleteSpace(e.target.value.toString() || '0'));
      const formated = this.formatCurrency.transform(this.roundCurrency.transform((value + ''), 'BTC'), 'short', 'BTC');
      // this.prevValue = formated;
      this.amountInput.setValue(formated);
    }
  }

  onInput(e) {
    if(e) {
      console.log(e.target.value);
      const value = parseFloat(this.deleteSpace(e.target.value.toString()));
      this.countPay(value);
    }
  }

  onFocus(e) {
    if(e) {
      this.input.nativeElement.setSelectionRange(0, this.input.nativeElement.value.length)
    }
  }

  confirmForm() {
    if(this.form.invalid) {
      return;
    }
    this.confirm.emit(this.amountInput.value)
  }

  deleteSpace(value): string {
    if (value) {
      const replaceMask = '';
      const searchMask = ' ';
      const regex = new RegExp(searchMask, 'ig');
      return value.toString().replace(regex, replaceMask);
    }
    return '';
  }

  getMaxAvailSum() {
    const sums = [this.IEOData.maxAmountPerClaim, this.IEOData.availableAmount];
    const userBalBTC = this.userBalanceBTC / this.IEOData.rate;
    sums.push(userBalBTC)

    if(this.IEOData.maxAmountPerUser) {
      if(this.IEOData.maxAmountPerUser >= this.userBalanceCoin) {
        sums.push(0);
      } else {
        sums.push(this.IEOData.maxAmountPerUser -  this.userBalanceCoin)
      }
    }
    this.maxSumValidate = +this.roundCurrency.transform(Math.min(...sums) + '', 'BTC');
    this.maxSumShow = this.formatCurrency.transform(this.maxSumValidate, 'short', 'BTC');
  }

  insertMax(e) {
    e.preventDefault();
    this.amountInput.setValue(this.maxSumShow);
    this.amountInput.updateValueAndValidity();
    this.countPay(this.maxSumValidate);
  }

  get amountInput () {
    return this.form.get('amount');
  }

}
