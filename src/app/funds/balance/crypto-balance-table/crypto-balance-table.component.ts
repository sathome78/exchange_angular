// import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// import {Store, select} from '@ngrx/store';
// import * as fundsReducer from '../../store/reducers/funds.reducer';
// import * as fundsAction from '../../store/actions/funds.actions';
// import {Observable} from 'rxjs';
// import {BalanceItem} from '../../models/balance-item.model';
// import {Router} from '@angular/router';
// import {DashboardWebSocketService} from '../../../dashboard/dashboard-websocket.service';
//
// @Component({
//   selector: 'app-crypto-balance-table',
//   templateUrl: './crypto-balance-table.component.html',
//   styleUrls: ['./crypto-balance-table.component.scss']
// })
// export class CryptoBalanceTableComponent implements OnInit {
//
//   @Output() cryptoWithdrawOut = new EventEmitter<BalanceItem>();
//   @Output() cryptoDepositOut = new EventEmitter<BalanceItem>();
//   @Output() transferOut = new EventEmitter<BalanceItem>();
//   public cryptoBalances$: Observable<BalanceItem[]>;
//   public countOfEntries$: Observable<number>;
//
//   public currentPage = 1;
//   public countPerPage = 15;
//
//   constructor(
//     private store: Store<fundsReducer.State>,
//     private dashboardWS: DashboardWebSocketService,
//     private router: Router,
//   ) {
//     this.cryptoBalances$ = store.pipe(select(fundsReducer.getCryptoBalancesSelector));
//     this.countOfEntries$ = store.pipe(select(fundsReducer.getCountCryptoBalSelector));
//   }
//
//   @Input('excludeZero') public excludeZero: boolean;
//
//   ngOnInit() {
//     this.loadBalances();
//   }
//
//   public onChangeItemsPerPage(items) {
//     //
//   }
//
//   changePage(page: number): void {
//     this.currentPage = page;
//     // this.loadOrders();
//   }
//
//   loadBalances() {
//     const params = {
//       offset: (this.currentPage - 1) * this.countPerPage,
//       limit: this.countPerPage,
//       hideCanceled: this.excludeZero,
//     };
//     this.store.dispatch(new fundsAction.LoadCryptoBalAction(params));
//   }
//
//   cryptoWithdraw(balance: BalanceItem): void {
//     this.cryptoWithdrawOut.emit(balance);
//   }
//
//   cryptoDeposit(balance: BalanceItem): void {
//     this.cryptoDepositOut.emit(balance);
//   }
//
//   goToTransfer(balance: BalanceItem): void {
//     this.transferOut.emit(balance);
//   }
//
//   goToTrade(balance: BalanceItem): void {
//     this.dashboardWS.isNeedChangeCurretPair = false;
//     this.store.dispatch(new fundsAction.LoadMaxCurrencyPairByCurrencyName(balance.currencyName));
//     this.router.navigate(['/']);
//   }
//
// }
