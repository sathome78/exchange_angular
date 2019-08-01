import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FundsComponent} from './funds.component';
import {BalanceComponent} from './balance/balance.component';
import {BalanceDetailsComponent} from './balance-details/balance-details.component';
import {PendingRequestDetailsComponent} from './pending-request-details/pending-request-details.component';
import {PendingRequestMobComponent} from './pending-request-mob/pending-request-mob.component';
import {PendingRequestInfoComponent} from './pending-request-info/pending-request-info.component';
import {BalanceMobileRoutesGuard} from 'app/shared/guards/balance-mobile-routes.guard';
import {TransactionHistoryComponent} from './transaction-history/transaction-history.component';
import {IEOBalanceDetailsComponent} from './ieo-balance-details/ieo-balance-details.component';
import {QuberaMobDetailsComponent} from './qubera-mob-details/qubera-mob-details.component';

const routers: Routes = [
  { path: '',
    component: FundsComponent,
    children: [
      { path: 'balances', component: BalanceComponent },
      { path: 'balances/ieo/:id', component: IEOBalanceDetailsComponent, canActivate: [BalanceMobileRoutesGuard] },
      { path: 'balances/fiat/:id', component: QuberaMobDetailsComponent, canActivate: [BalanceMobileRoutesGuard] },
      { path: 'balances/:id', component: BalanceDetailsComponent, canActivate: [BalanceMobileRoutesGuard] },
      { path: 'pending-requests', component: PendingRequestMobComponent, canActivate: [BalanceMobileRoutesGuard] },
      { path: 'pending-requests/:id', component: PendingRequestDetailsComponent, canActivate: [BalanceMobileRoutesGuard] },
      { path: 'pending-requests/:id/info', component: PendingRequestInfoComponent, canActivate: [BalanceMobileRoutesGuard] },
      { path: 'transaction-history', component: TransactionHistoryComponent},
      { path: '', pathMatch: 'full', redirectTo: '/funds/balances'},
      { path: '**', redirectTo: 'balances'}
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routers) ],
  exports: [ RouterModule ]
})
export class FundsRoutingModule {
}
