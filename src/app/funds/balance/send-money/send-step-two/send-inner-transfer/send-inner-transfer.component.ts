import { Component, OnInit } from '@angular/core';
import { BalanceService } from '../../../../services/balance.service';

@Component({
  selector: 'app-send-inner-transfer',
  templateUrl: './send-inner-transfer.component.html',
  styleUrls: ['./send-inner-transfer.component.scss'],
})
export class SendInnerTransferComponent implements OnInit {

  constructor(
    public balanceServce: BalanceService,
  ) { }

  ngOnInit() {
  }

  chooseTransfer(name: string) {
    this.balanceServce.goToSendMoneyInnerTransfer$.next(name);
  }

}
