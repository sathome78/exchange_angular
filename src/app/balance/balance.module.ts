import {NgModule} from '@angular/core';
import { CryptoBalancesComponent } from './crypto-balances/crypto-balances.component';
import { FiatBalancesComponent } from './fiat-balances/fiat-balances.component';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import {BalanceComponent} from './balance.component';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    BalanceComponent,
  CryptoBalancesComponent,
  FiatBalancesComponent,
  PendingRequestComponent],
  exports: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  providers: [
  ]
})
export class BalanceModule {

}
