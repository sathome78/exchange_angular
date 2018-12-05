import {Component, OnDestroy, OnInit} from '@angular/core';
import {BalanceCrypto} from '../model';
import {BalanceService} from './balance.service';
import {Subject} from 'rxjs';
import { takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public balanceTab: string;
  public showRefillBalancePopup: boolean;
  public showSendMoneyPopup: boolean;
  public cryptoBalances: BalanceCrypto[];

  constructor(
    // public balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.setFields();

    // this.balanceService.showRefillBalance$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(res => this.showRefillBalancePopup = res);
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
