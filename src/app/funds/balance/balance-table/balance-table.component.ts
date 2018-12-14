import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';
import * as fundsAction from '../../store/actions/funds.actions';
import {DashboardWebSocketService} from '../../../dashboard/dashboard-websocket.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fundsReducer from '../../store/reducers/funds.reducer';

@Component({
  selector: 'app-balance-table',
  templateUrl: './balance-table.component.html',
  styleUrls: ['./balance-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceTableComponent {
  constructor(
    private store: Store<fundsReducer.State>,
    private dashboardWS: DashboardWebSocketService,
    private router: Router,
  ) {}

  @Input('balances') public balances: BalanceItem[] = [];
  @Input('countPerPage') public countPerPage: number;
  @Input('currentPage') public currentPage: number;
  @Input('countOfEntries') public countOfEntries: number;
  @Output('onPaginate') public onPaginate: EventEmitter<any> = new EventEmitter();
  @Output('cryptoWithdrawOut') public cryptoWithdrawOut: EventEmitter<any> = new EventEmitter();
  @Output('cryptoDepositOut') public cryptoDepositOut: EventEmitter<any> = new EventEmitter();
  @Output('transferOut') public transferOut: EventEmitter<any> = new EventEmitter();

  public changeItemsPerPage(items: number) {
    this.onPaginate.emit({currentPage: this.currentPage, countPerPage: items});
  }

  public changePage(page: number): void {
    this.onPaginate.emit({currentPage: page, countPerPage: this.countPerPage});
  }

  goToTrade(balance: BalanceItem): void {
    this.dashboardWS.isNeedChangeCurretPair = false;
    this.store.dispatch(new fundsAction.LoadMaxCurrencyPairByCurrencyName(balance.currencyName));
    this.router.navigate(['/']);
  }

}
