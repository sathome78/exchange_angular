import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FundsComponent} from './funds.component';
import {BalanceComponent} from './balance/balance.component';

const routers: Routes = [
  { path: '',
    component: FundsComponent,
    children: [
      { path: 'balances', component: BalanceComponent },
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
