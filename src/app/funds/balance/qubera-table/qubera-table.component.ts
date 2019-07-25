import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KYC_STATUS, PENDING } from 'app/shared/constants';
import { PopupService } from 'app/shared/services/popup.service';
import { BalanceService } from 'app/funds/services/balance.service';
import { first } from 'rxjs/operators';
import { balanceQubera } from 'app/funds/models/balance-qubera.model';

@Component({
  selector: 'app-qubera-table',
  templateUrl: './qubera-table.component.html',
  styleUrls: ['./qubera-table.component.scss']
})
export class QuberaTableComponent implements OnInit {

  quberaBalance: balanceQubera[] = [];

  @Input('balances') set balances(balances) {
    if (balances && balances.data) {
      this.checkBalance(balances);
      this._balances = balances.data;
    } else {
      this._balances = [];
    }
  }
  get balances() {
    return this._balances;
  }
  private _balances;
  @Input() public kycStatus: string;
  @Input() public loading: boolean;
  @Output() public cryptoWithdrawQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public cryptoDepositQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public transferQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output() public quberaKycVerification: EventEmitter<any> = new EventEmitter();
  @Output() public createQuberaAccount: EventEmitter<any> = new EventEmitter();
  public 'KYC_STATUS' = KYC_STATUS;
  public 'PENDING' = PENDING;

  constructor(private balanceService: BalanceService) {
    }

  ngOnInit() {
    this.checkQuberaAccount();
  }

  checkBalance(balance) {
    if (this.kycStatus === KYC_STATUS.SUCCESS) {
      this.quberaBalance = [balance.data];
    }
  }

  checkQuberaAccount() {
    this.balanceService.checkQuberaAccount('EUR')
      .pipe(first())
      .subscribe((data: balanceQubera) => {
      });
  }
}
