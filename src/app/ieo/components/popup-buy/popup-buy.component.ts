import {Component, Input, OnInit, Output, EventEmitter, OnChanges} from '@angular/core';
import {IEOItem} from 'app/model/ieo.model';
import {Store} from '@ngrx/store';
import {State} from 'app/core/reducers';
import {keys} from '../../../shared/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-popup-buy',
  templateUrl: './popup-buy.component.html',
  styleUrls: ['./popup-buy.component.scss']
})
export class PopupBuyComponent implements OnInit, OnChanges {

  public form: FormGroup;
  // @Input() show: boolean;
  @Input() IEOData: IEOItem;
  public userBalanceBTC: number;
  public userBalanceCoin: number;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  public minSum: number = 0;
  public maxSum: number = 1;
  public pay: number = 0;
  public loading: boolean = true;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.userService.getUserBalanceCurr(['BTC', this.IEOData.currencyName])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.userBalanceBTC = res.data['BTC'];
        this.userBalanceCoin = res.data[this.IEOData.currencyName];
        this.maxSum = this.getMaxAvailSum();
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
    });
  }

  private minCheck(amount: FormControl) {
    if (this.minSum > (!!amount.value ? amount.value : 0)) {
      return {'minThen': true};
    }
    return null;
  }

  private maxCheck(amount: FormControl) {
    if (this.maxSum <= (!!amount.value ? amount.value : 0)) {
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


  onInput(val) {
    this.countPay(val.target.input);
  }

  confirmForm() {
    if(this.form.invalid) {
      return;
    }
    this.confirm.emit(this.form.get('amount').value)
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
    return Math.min(...sums);
  }

  insertMax(e) {
    e.preventDefault();
    this.form.controls['amount'].setValue(this.maxSum)
  }

}
