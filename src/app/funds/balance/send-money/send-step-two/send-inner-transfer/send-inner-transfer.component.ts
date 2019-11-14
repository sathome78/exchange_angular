import { Component, OnInit, Input } from '@angular/core';
import { BalanceService } from '../../../../services/balance.service';
import { takeUntil } from 'rxjs/operators';
import { BalanceItem } from 'app/funds/models/balance-item.model';
import { Subject } from 'rxjs';
import { TransferMerchantResponse, TransferMerchant } from 'app/funds/models/transfer-models.model';

@Component({
  selector: 'app-send-inner-transfer',
  templateUrl: './send-inner-transfer.component.html',
  styleUrls: ['./send-inner-transfer.component.scss'],
})
export class SendInnerTransferComponent implements OnInit {
  @Input() balanceData: BalanceItem;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public loading = true;
  public merchantData: TransferMerchant[] = [];
  public viewsList = {
    LOADING: 'loading',
    ERROR: 'error',
    MAIN: 'main',
    DENIED: 'denied',
  };
  public VIEW = this.viewsList.LOADING;

  constructor(public balanceService: BalanceService) {}

  ngOnInit() {
    this.setView(this.viewsList.LOADING);
    this.balanceService.getTransferMerchants(this.balanceData ? this.balanceData.currencyName : 'BTC')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: TransferMerchantResponse) => {
        this.merchantData = res.merchantCurrencies;
        if (this.merchantData && this.merchantData.length && res.operationRestrictedToUser) {
          this.setView(this.viewsList.DENIED);
        } else {
          this.setView(this.viewsList.MAIN);
        }
      }, err => {
        this.setView(this.viewsList.ERROR);
        console.error(err);
      });
  }

  chooseTransfer(name: string, merchant) {
    this.balanceService.goToSendMoneyInnerTransfer$.next({ name, merchant });
  }

  setView(view) {
    this.VIEW = view;
  }
}
