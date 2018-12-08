import {Component, OnInit, Input} from '@angular/core';
import {Store, select} from '@ngrx/store';
import * as fundsReducer from '../../store/reducers/funds.reducer';
import * as fundsAction from '../../store/actions/funds.actions';
import {Observable} from 'rxjs';
import {BalanceItem} from '../../models/balance-item.model';

@Component({
  selector: 'app-crypto-balance-table',
  templateUrl: './crypto-balance-table.component.html',
  styleUrls: ['./crypto-balance-table.component.scss']
})
export class CryptoBalanceTableComponent implements OnInit {

  public cryptoBalances$: Observable<BalanceItem[]>;
  public countOfEntries$: Observable<number>;

  public currentPage = 1;
  public countPerPage = 15; 

  constructor(private store: Store<fundsReducer.State>) {
    this.cryptoBalances$ = store.pipe(select(fundsReducer.getCryptoBalancesSelector));
    this.countOfEntries$ = store.pipe(select(fundsReducer.getCountCryptoBalSelector));
  }
  @Input('excludeZero') public excludeZero: boolean;

  ngOnInit() {
    this.loadBalances()
  }

  public onChangeItemsPerPage(items) {
    //
  }

  changePage(page: number): void {
    this.currentPage = page;
    // this.loadOrders();
  }

  loadBalances() {
    const params = {
      offset: (this.currentPage - 1) * this.countPerPage, 
      limit: this.countPerPage,
      hideCanceled: this.excludeZero,
    }
    this.store.dispatch(new fundsAction.LoadCryptoBalAction(params));
  }

}
