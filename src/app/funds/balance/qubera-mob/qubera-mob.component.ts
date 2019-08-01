import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { balanceQubera } from 'app/funds/models/balance-qubera.model';
import { KYC_STATUS } from 'app/shared/constants';

@Component({
  selector: 'app-qubera-mob',
  templateUrl: './qubera-mob.component.html',
  styleUrls: ['./qubera-mob.component.scss'],
})
export class QuberaMobComponent implements OnInit {
  tableScrollStyles: any = {};
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
  @Input() public countOfPendingRequests = 0;
  @Input() public Tab;
  @Input() public loading: boolean;
  @Input() public currTab;
  @Output() public selectTab: EventEmitter<any> = new EventEmitter();
  @Output() public createQuberaAccount: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output() public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  @Output() public quberaKycVerification: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.setScrollStyles();
  }

  setScrollStyles() {
    const componentHeight = window.innerHeight;
    this.tableScrollStyles = {
      height: componentHeight - 293 + 'px',
      'overflow-x': 'scroll',
    };
  }

  ngOnInit() {}

  checkBalance(balance) {
    if (this.kycStatus === KYC_STATUS.SUCCESS) {
      this.quberaBalance = [balance.data];
    }
  }
}
