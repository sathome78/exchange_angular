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
    this.checkBalance(balances);
    this._balances = balances;
  }
  get balances() {
    return this._balances;
  }
  private _balances;
  @Input('kycStatus') public kycStatus: string;
  @Input('loading') public loading: boolean;
  @Output('cryptoWithdrawQuberaOut') public cryptoWithdrawQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('cryptoDepositQuberaOut') public cryptoDepositQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('transferQuberaOut') public transferQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('quberaKycVerification') public quberaKycVerification: EventEmitter<any> = new EventEmitter();
  @Output('createQuberaAccount') public createQuberaAccount: EventEmitter<any> = new EventEmitter();
  public 'KYC_STATUS' = KYC_STATUS;
  public 'PENDING' = PENDING;

  constructor(private balanceService: BalanceService) {
    }

  ngOnInit() {
    this.checkQuberaAccount();
  }

  checkBalance(balance) {
    if (this.kycStatus === KYC_STATUS.SUCCESS && !balance.length) {
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
