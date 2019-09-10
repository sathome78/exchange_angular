import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ADRIAN_NEXT_KYC_STATUS } from 'app/shared/constants';
import { BalanceService } from 'app/funds/services/balance.service';
import { QuberaBalanceModel } from 'app/model/qubera-balance.model';

@Component({
  selector: 'app-qubera-table',
  templateUrl: './qubera-table.component.html',
  styleUrls: ['./qubera-table.component.scss'],
})
export class QuberaTableComponent implements OnInit {
  public _kycStatus: string;
  @Input() public balances: QuberaBalanceModel;
  @Input()
  get kycStatus() {
    return this._kycStatus;
  }
  set kycStatus(value) {
    if (value === null) {
      this._kycStatus = 'NULL';
    } else {
      this._kycStatus = value.toUpperCase();
    }
  }
  @Input() public loading: boolean;
  @Output() public cryptoWithdrawQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public cryptoDepositQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public transferQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public quberaKycVerification: EventEmitter<any> = new EventEmitter();
  @Output() public createQuberaAccount: EventEmitter<any> = new EventEmitter();
  public KYC_STATUS = ADRIAN_NEXT_KYC_STATUS;

  constructor(private balanceService: BalanceService) {}

  ngOnInit() {
    // this.checkQuberaAccount();
  }

  // checkQuberaAccount() {
  //   this.balanceService
  //     .checkQuberaAccount(EUR)
  //     .pipe(first())
  //     .subscribe((data: balanceQubera) => {});
  // }

  trackByFn(index, item) {
    return index;
  }
}
