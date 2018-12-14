
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BalanceItem} from '../models/balance-item.model';
import {Subject} from 'rxjs';
import {BalanceCrypto} from '../../model';
import { BalanceService } from '../services/balance.service';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {State} from 'app/core/reducers';
import {ChangeCurrencyPairAction} from '../../dashboard/actions/dashboard.actions';
import {
  LoadAllCurrenciesForChoose, LoadCryptoCurrenciesForChoose, LoadFiatCurrenciesForChoose,
  SetAllCurrenciesForChoose,
  SetCryptoCurrenciesForChoose,
  SetFiatCurrenciesForChoose
} from '../store/actions/funds.actions';
import {CRYPTO_DEPOSIT, CRYPTO_WITHDRAWAL, INNER_TRANSFER} from './send-money/send-money-constants';

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
  public sendMoneyData = {};
  public refillBalanceData = {};

  constructor(
    public balanceService: BalanceService,
    private store: Store<State>,
  ) { }

  ngOnInit() {

    this.store.dispatch(new LoadAllCurrenciesForChoose());
    this.store.dispatch(new LoadCryptoCurrenciesForChoose());
    this.store.dispatch(new LoadFiatCurrenciesForChoose());

    this.balanceService.closeRefillMoneyPopup$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.openRefillBalancePopup(res);
      });

    this.balanceService.closeSendMoneyPopup$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.openSendMoneyPopup(res);
      });
  }

  public onSelectTab(tab: string): void {
    this.currTab = tab;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openRefillBalancePopup(flag: boolean) {
    this.refillBalanceData = {};
    this.showRefillBalancePopup = flag;
  }

  public openSendMoneyPopup(flag: boolean) {
    this.sendMoneyData = {};
    this.showSendMoneyPopup = flag;
  }

  goToCryptoWithdrawPopup(balance: BalanceItem): void {
    this.showSendMoneyPopup = true;
    this.sendMoneyData = {
      step: 2,
      stepName: CRYPTO_WITHDRAWAL,
      balance: balance
    };
  }

  goToCryptoDepositPopup(balance: BalanceItem): void {
    this.showRefillBalancePopup = true;
    this.refillBalanceData = {
      step: 2,
      stepName: CRYPTO_DEPOSIT,
      balance: balance
    };
  }

  goToTransferPopup(balance: BalanceItem): void {
    this.showSendMoneyPopup = true;
    this.sendMoneyData = {
      step: 2,
      stepName: INNER_TRANSFER,
      stepThreeData: balance
    };
  }

}
