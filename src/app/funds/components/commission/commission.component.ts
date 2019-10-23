import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionComponent implements OnInit {
  private _baseAmount = 0;
  @Input() public type: 'refill' | 'withdraw';
  @Input() public merchant;
  @Input() public currencyName: string;
  @Input() set baseAmount(val) {
    if (!isNaN(+val)) {
      this._baseAmount = +val;
    } else {
      this._baseAmount = 0;
    }
  }
  get baseAmount() {
    return this._baseAmount;
  }

  constructor(public utilsService: UtilsService) { }

  ngOnInit() {
  }

  get merchantCommission() {
    return this.type === 'refill' ? this.merchant.inputCommission : this.merchant.outputCommission;
  }

  get fixedMerchantCommission() {
    return this.merchant.fixedMinCommission;
  }

  get merchantCommissionValue() {
    if (+this.baseAmount === 0) {
      return 0;
    }
    const countedCommision = this.baseAmount / 100 * this.merchantCommission;
    return countedCommision > this.fixedMerchantCommission ? countedCommision : this.fixedMerchantCommission;
  }

  get totalValue() {
    return this.baseAmount - this.merchantCommissionValue;
  }

}
