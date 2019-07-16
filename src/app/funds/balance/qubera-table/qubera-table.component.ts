import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KYC_STATUS, PENDING} from 'app/shared/constants';
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

  @Input('balances') public balances: any;
  @Input('kycStatus') public kycStatus: string;
  @Input('existQuberaAccounts') public existQuberaAccounts: string;
  @Output('cryptoWithdrawQuberaOut') public cryptoWithdrawQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('cryptoDepositQuberaOut') public cryptoDepositQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('transferQuberaOut') public transferQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('createFugAccount') public createFugAccount: EventEmitter<any> = new EventEmitter();
  @Output('createCurrency') public createCurrency: EventEmitter<any> = new EventEmitter();
  public 'KYC_STATUS' = KYC_STATUS;
  public 'PENDING' = PENDING;

  constructor(
    private popupService: PopupService,
    private balanceService: BalanceService) { 
    }

  ngOnInit() {
    this.checkInfoAboutAccount();
    this.quberaBalance.push(this.balances.data);
    console.log(this.kycStatus);
    console.log(this.quberaBalance);

  }

  showPopup() {
    this.popupService.showSomePopupQubera("1");
  }

  checkInfoAboutAccount() {
    this.balanceService.checkInfoAboutAccount('EUR')
    .pipe(first())
    .subscribe((data: balanceQubera) => {
    });
  }
}
