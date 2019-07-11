import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KYC_STATUS, PENDING} from 'app/shared/constants';
import { PopupService } from 'app/shared/services/popup.service';

@Component({
  selector: 'app-qubera-table',
  templateUrl: './qubera-table.component.html',
  styleUrls: ['./qubera-table.component.scss']
})
export class QuberaTableComponent implements OnInit {

  @Input('balances') public balances: any[] = [];
  @Input('kycStatus') public kycStatus: string;
  @Input('existQuberaAccounts') public existQuberaAccounts: string;
  @Output('cryptoWithdrawQuberaOut') public cryptoWithdrawQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('cryptoDepositQuberaOut') public cryptoDepositQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('transferQuberaOut') public transferQuberaOut: EventEmitter<any> = new EventEmitter();
  @Output('createFugAccount') public createFugAccount: EventEmitter<any> = new EventEmitter();
  public 'KYC_STATUS' = KYC_STATUS;
  public 'PENDING' = PENDING;

  constructor(
    private popupService: PopupService) { }

  ngOnInit() {
  }

  showPopup() {
    this.popupService.showSomePopupQubera(true);
  }

}
