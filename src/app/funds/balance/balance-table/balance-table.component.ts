import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, OnDestroy} from '@angular/core';
import {BalanceItem} from '../../models/balance-item.model';
import * as fundsAction from '../../store/actions/funds.actions';
import {DashboardWebSocketService} from '../../../dashboard/dashboard-websocket.service';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as fundsReducer from '../../store/reducers/funds.reducer';
import {getCurrencyPairArray, State} from 'app/core/reducers';
import {takeUntil} from 'rxjs/operators';
import {CurrencyPair} from '../../../model';
import {Subject} from 'rxjs';
import {BalanceService} from '../../services/balance.service';
import {UtilsService} from 'app/shared/services/utils.service';

@Component({
  selector: 'app-balance-table',
  templateUrl: './balance-table.component.html',
  styleUrls: ['./balance-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceTableComponent {

  constructor(
    public balanceService: BalanceService,
    private utils: UtilsService,
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

  public isFiat(currName: string): boolean {
    return this.utils.isFiat(currName);
  }

}
