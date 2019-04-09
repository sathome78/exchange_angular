import {Component, Input, OnInit, Output, EventEmitter, OnChanges} from '@angular/core';
import {IEOItem} from 'app/model/ieo.model';
import {Store} from '@ngrx/store';
import {State} from 'app/core/reducers';
import {keys} from '../../../shared/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup-buy',
  templateUrl: './popup-buy.component.html',
  styleUrls: ['./popup-buy.component.scss']
})
export class PopupBuyComponent implements OnInit, OnChanges {

  public form: FormGroup;
  @Input() show: boolean;
  @Input() IEOData: IEOItem;
  @Input() userBalanceBTC: number;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  public minSum: number = 0;
  public maxSum: number = 1;
  public pay: number = 0;

  constructor(

  ) { }

  ngOnInit() {
    this.initForm()
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

  public getMaxAvailSum(IEOData, userBalanceBTC, ) {
    const sums = [IEOData.maxAmountPerClaim, IEOData.availableAmount];
    const userBalBTC = userBalanceBTC / IEOData.rate;
    sums.push(userBalBTC)

  }

}
