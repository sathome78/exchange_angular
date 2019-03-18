import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KYC_STATUS, PENDING} from 'app/shared/constants';

@Component({
  selector: 'app-qubera-table',
  templateUrl: './qubera-table.component.html',
  styleUrls: ['./qubera-table.component.scss']
})
export class QuberaTableComponent implements OnInit {

  @Input('balances') public balances: any[] = [];
  @Input('kycStatus') public kycStatus: string;
  @Input('existQuberaAccounts') public existQuberaAccounts: string;
  @Output('cryptoWithdrawOut') public cryptoWithdrawOut: EventEmitter<any> = new EventEmitter();
  @Output('cryptoDepositOut') public cryptoDepositOut: EventEmitter<any> = new EventEmitter();
  @Output('transferOut') public transferOut: EventEmitter<any> = new EventEmitter();
  public 'KYC_STATUS' = KYC_STATUS;
  public 'PENDING' = PENDING;

  constructor() { }

  ngOnInit() {
  }

}
