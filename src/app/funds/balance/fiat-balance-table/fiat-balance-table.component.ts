import {Component, OnInit, Input} from '@angular/core';
import {Store, select} from '@ngrx/store';
import * as fundsReducer from '../../store/reducers/funds.reducer';
import * as fundsAction from '../../store/actions/funds.actions';
import {Observable} from 'rxjs';
import {BalanceItem} from '../../models/balance-item.model';

@Component({
  selector: 'app-fiat-balance-table',
  templateUrl: './fiat-balance-table.component.html',
  styleUrls: ['./fiat-balance-table.component.scss']
})
export class FiatBalanceTableComponent implements OnInit {

  public balances$: Observable<BalanceItem[]>;
  public countOfEntries$: Observable<number>;

  public currentPage = 1;
  public countPerPage = 15; 

  constructor(private store: Store<fundsReducer.State>) {
    this.balances$ = store.pipe(select(fundsReducer.getFiatBalancesSelector))
    this.balances$.subscribe((res) => {console.log(res)});
    this.countOfEntries$ = store.pipe(select(fundsReducer.getCountFiatBalSelector));
  }
  @Input('excludeZero') public excludeZero: boolean;

  ngOnInit() {
    this.loadBalances()
  }

  public onChangeItemsPerPage(items) {
    this.countPerPage = items;
    this.loadBalances();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadBalances();
  }

  loadBalances() {
    const params = {
      type: 'FIAT',
      offset: (this.currentPage - 1) * this.countPerPage, 
      limit: this.countPerPage,
      hideCanceled: this.excludeZero,
    }
    this.store.dispatch(new fundsAction.LoadFiatBalAction(params));
  }

}
