import {NgModule} from '@angular/core';
import { CryptoBalancesComponent } from './crypto-balances/crypto-balances.component';
import { FiatBalancesComponent } from './fiat-balances/fiat-balances.component';
import { PendingRequestComponent } from './pending-request/pending-request.component';

@NgModule({
  declarations: [
  CryptoBalancesComponent,
  FiatBalancesComponent,
  PendingRequestComponent],
  exports: [
  ],
  imports: [
  ],
  providers: [
  ]
})
export class BalanceModule {

}
