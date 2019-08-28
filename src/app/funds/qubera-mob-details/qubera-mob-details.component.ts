import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import * as fromCore from '../../core/reducers';
import * as fundsReducer from '../store/reducers/funds.reducer';
import * as fundsAction from '../store/actions/funds.actions';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, withLatestFrom, first } from 'rxjs/operators';
import { KYC_STATUS } from 'app/shared/constants';
import { Router } from '@angular/router';
import { QuberaBalanceModel } from 'app/model/qubera-balance.model';
import { BalanceService } from '../services/balance.service';
import { BalanceItem } from '../models/balance-item.model';
import { EUR } from '../balance/balance-constants';

@Component({
  selector: 'app-qubera-mob-details',
  templateUrl: './qubera-mob-details.component.html',
  styleUrls: ['./qubera-mob-details.component.scss'],
})
export class QuberaMobDetailsComponent implements OnInit, OnDestroy {
  public balance: QuberaBalanceModel;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public showQuberaPopup = false;
  public quberaData: any;
  public loading = true;

  constructor(
    private location: Location,
    private store: Store<fromCore.State>,
    public router: Router,
    public balanceService: BalanceService
  ) {
    this.store
      .pipe(select(fundsReducer.getQuberaBalancesSelector))
      .pipe(withLatestFrom(this.store.pipe(select(fundsReducer.getQuberaKycStatusSelector))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([balances, kysStatus]) => {
        if (kysStatus !== KYC_STATUS.SUCCESS && !balances) {
          this.router.navigate(['/funds/balances']);
        } else {
          this.balance = balances;
        }
        this.loading = false;
      });
  }

  ngOnInit() {}

  public onGoBackToMain(): void {
    this.location.back();
  }

  public goToQuberaWithdrawPopup(): void {
    this.balanceService
      .getCurrencyData(EUR)
      .pipe(first())
      .subscribe((data: any) => {
        this.showQuberaPopup = true;
        this.quberaData = {
          component: 'WITHDRAW',
          balance: data,
        };
      });
  }

  public goToQuberaDepositPopup(): void {
    this.balanceService
      .getCurrencyData(EUR)
      .pipe(first())
      .subscribe((data: any) => {
        this.showQuberaPopup = true;
        this.quberaData = {
          component: 'DEPOSIT',
          balance: data,
        };
      });
  }

  public openQuberaPopup(flag: boolean) {
    this.quberaData = {};
    this.showQuberaPopup = flag;
  }

  public getTableAndKYCStatus() {
    this.store.dispatch(new fundsAction.LoadQuberaBalAction());
    this.store.dispatch(new fundsAction.LoadQuberaKycStatusAction());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
