import {Component, OnDestroy, OnInit} from '@angular/core';
import {BalanceItem} from './balance-item.model';
import {BalanceService} from '../../shared/services/balance.service';
import {Subject} from 'rxjs';
import {BalanceCrypto} from '../../model';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {

  balanceItems: BalanceItem [] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public balanceTab: string;
  public showRefillBalancePopup: boolean;
  public showSendMoneyPopup: boolean;
  public cryptoBalances: BalanceCrypto[];

  constructor(private balanceService: BalanceService) { }

  ngOnInit() {
    this.setFields();
    this.balanceService.getBalanceItems().subscribe(items => {
      this.balanceItems = items;
      console.log(this.balanceItems);
    });
  }

  ngOnDestroy(): void {
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }

  public toggleBalanceTab(tab: string) {
    this.balanceTab = tab;
  }

  public isShowBalanceTab(tab: string): boolean {
    return this.balanceTab === tab;
  }

  public openRefillBalancePopup(flag: boolean) {
    this.showRefillBalancePopup = flag;
  }

  public openSendMoneyPopup(flag: boolean) {
    this.showSendMoneyPopup = flag;
  }

  private setFields() {
    this.balanceTab = 'crypto-tab';
    this.showRefillBalancePopup = false;
    this.showSendMoneyPopup = false;
  }
}
