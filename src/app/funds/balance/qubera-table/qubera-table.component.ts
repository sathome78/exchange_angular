import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KYC_STATUS, PENDING } from 'app/shared/constants';
import { PopupService } from 'app/shared/services/popup.service';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';
import { balanceQubera } from 'app/funds/models/balance-qubera.model';
import { EUR } from '../balance-constants';
import { QuberaBalanceModel } from 'app/model/qubera-balance.model';

@Component({
  selector: 'app-qubera-table',
  templateUrl: './qubera-table.component.html',
  styleUrls: ['./qubera-table.component.scss'],
})
export class QuberaTableComponent implements OnInit {
  @Input() public balances: QuberaBalanceModel;
  @Input() public kycStatus: string;
  @Input() public loading: boolean;
  @Output() public cryptoWithdrawQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public cryptoDepositQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public transferQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public quberaKycVerification: EventEmitter<any> = new EventEmitter();
  @Output() public createQuberaAccount: EventEmitter<any> = new EventEmitter();
  public KYC_STATUS = KYC_STATUS;

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
