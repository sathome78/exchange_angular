import { Component, Input, OnInit, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { IEOItem } from 'app/model/ieo.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-popup-buy',
  templateUrl: './popup-buy.component.html',
  styleUrls: ['./popup-buy.component.scss'],
})
export class PopupBuyComponent implements OnInit, OnChanges {
  public form: FormGroup;
  @ViewChild('input') input: ElementRef;
  @Input() IEOData: IEOItem;
  @Input() loading: boolean;
  public userBalanceBTC = 0;
  public userBalanceCoin = 0;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  public minSum = 0;
  public maxSumValidate = 1;
  public maxSumShow = '';
  public pay = 0;
  public inputValue = 0;
  public isSubmited = false;
  private checkCyrilic = /[а-яА-ЯёЁ]/gi;
  public prevValue;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.userService
      .getUserBalanceCurr(['BTC', this.IEOData.currencyName])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.userBalanceBTC = +res.data['BTC'];
        this.userBalanceCoin = +res.data[this.IEOData.currencyName];
        this.getMaxAvailSum();
        this.loading = false;
      });
  }

  ngOnChanges(c) {
    if (c.IEOData && c.IEOData.currentValue) {
      this.minSum = c.IEOData.currentValue.minAmount;
    }
    if (c.show && c.show.currentValue) {
      this.form.reset();
    }
  }

  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('', [
        Validators.required,
        this.minCheck.bind(this),
        this.maxCheck.bind(this),
      ]),
    });
  }

  private minCheck(amount: FormControl) {
    if (this.minSum > (!!amount.value ? this.deleteSpace(amount.value) : 0)) {
      return { minThen: true };
    }
    return null;
  }

  private maxCheck(amount: FormControl) {
    if (this.maxSumValidate < (!!amount.value ? +this.deleteSpace(amount.value) : 0)) {
      return { maxThen: true };
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
    if (e) {
      const value = parseFloat(this.deleteSpace(e.target.value.toString() || '0'));
      const formated = this.utilsService.currencyFormat(value);
      this.amountInput.setValue(formated);
    }
  }

  onInput(e) {
    const val = e.target.value;
    if (new RegExp(this.checkCyrilic).test(val.toString())) {
      this.amountInput.setValue(val.toString().substr(0, val.length - 1));
    }
    if (e) {
      const value = parseFloat(this.deleteSpace(val.toString()));
      this.countPay(value);
    }
  }

  onFocus(e) {
    if (e) {
      this.input.nativeElement.setSelectionRange(0, this.input.nativeElement.value.length);
    }
  }

  confirmForm(e) {
    e.preventDefault();
    this.isSubmited = true;
    if (this.form.invalid) {
      return;
    }
    this.confirm.emit(this.deleteSpace(this.amountInput.value));
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
    const userBalBTC = this.userBalanceBTC / this.IEOData.rate;
    if (!+this.IEOData.maxAmountPerClaim && !+this.IEOData.maxAmountPerUser) {
      this.maxSumValidate = +this.deleteSpace(Math.min(+this.IEOData.availableAmount, userBalBTC));
      this.maxSumShow = this.utilsService.currencyFormat(this.maxSumValidate);
      return;
    }
    const sums = [+this.IEOData.maxAmountPerClaim, +this.IEOData.availableAmount];
    sums.push(userBalBTC);

    if (this.IEOData.maxAmountPerUser) {
      if (this.IEOData.maxAmountPerUser <= this.userBalanceCoin) {
        sums.push(0);
      } else {
        sums.push(this.IEOData.maxAmountPerUser - this.userBalanceCoin);
      }
    }
    this.maxSumValidate = +this.deleteSpace(Math.min(...sums) + '');
    this.maxSumShow = this.utilsService.currencyFormat(this.maxSumValidate);
  }

  insertMax(e) {
    e.preventDefault();
    this.amountInput.setValue(this.maxSumShow);
    this.amountInput.updateValueAndValidity();
    this.countPay(this.maxSumValidate);
  }

  get amountInput() {
    return this.form.controls['amount'];
  }
}
