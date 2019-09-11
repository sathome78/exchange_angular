import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ADRIAN_NEXT_KYC_STATUS } from 'app/shared/constants';
import { EUR } from '../balance-constants';
import { UtilsService } from 'app/shared/services/utils.service';
import { QuberaBalanceModel } from 'app/model/qubera-balance.model';

@Component({
  selector: 'app-qubera-mob',
  templateUrl: './qubera-mob.component.html',
  styleUrls: ['./qubera-mob.component.scss'],
})
export class QuberaMobComponent implements OnInit {
  tableScrollStyles: any = {};
  EUR = EUR;

  public _kycStatus: string;
  @Input() public balances: QuberaBalanceModel;
  @Input()
  get kycStatus() {
    return this._kycStatus;
  }
  set kycStatus(value) {
    // this._kycStatus = 'ERROR';
    // this._kycStatus = 'OK';
    // this._kycStatus = 'WARN';
    // this._kycStatus = 'NONE';
    // this._kycStatus = 'NULL';

    if (value === null) {
      this._kycStatus = 'NULL';
    } else {
      this._kycStatus = value.toUpperCase();
    }
  }
  @Input() public countOfPendingRequests = 0;
  @Input() public Tab;
  @Input() public loading: boolean;
  @Input() public currTab;
  @Output() public selectTab: EventEmitter<any> = new EventEmitter();
  @Output() public createQuberaAccount: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() public openRefillBalancePopup: EventEmitter<any> = new EventEmitter();
  @Output() public openSendMoneyPopup: EventEmitter<any> = new EventEmitter();
  @Output() public quberaKycVerification: EventEmitter<any> = new EventEmitter();
  @Output() public goToQuberaDetails: EventEmitter<any> = new EventEmitter();
  public KYC_STATUS = ADRIAN_NEXT_KYC_STATUS;

  constructor(public utilsService: UtilsService) {
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

  onShowMobDetails(currencyCode): void {
    this.goToQuberaDetails.emit({ currencyCode });
  }

  trackByFn(index, item) {
    return index;
  }
}
