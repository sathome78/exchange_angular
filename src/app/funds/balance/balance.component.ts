
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BalanceItem} from '../models/balance-item.model';
import {Subject} from 'rxjs';
import {BalanceCrypto} from '../../model';
import { BalanceService } from '../services/balance.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {

  /** */
  public Tab = {
    CRYPTO: 'CRYPTO',
    FIAT: 'FIAT',
    PR: 'PR',
  }

  public balanceItems: BalanceItem [] = [];
  public currTab: string = this.Tab.CRYPTO;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showRefillBalancePopup: boolean = false;
  public showSendMoneyPopup: boolean = false;
  public cryptoBalances: BalanceCrypto[];

  constructor() { }

  ngOnInit() {

  }

  public onSelectTab(tab: string): void {
    this.currTab = tab;
  }
  ngOnDestroy(): void {
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }

  public openRefillBalancePopup(flag: boolean) {
    this.showRefillBalancePopup = flag;
  }

  public openSendMoneyPopup(flag: boolean) {
    this.showSendMoneyPopup = flag;
  }

}
