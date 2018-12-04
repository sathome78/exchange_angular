import {NgModule} from '@angular/core';
import { CryptoBalancesComponent } from './crypto-balances/crypto-balances.component';
import { FiatBalancesComponent } from './fiat-balances/fiat-balances.component';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import {BalanceComponent} from './balance.component';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RefillInnerTransferComponent} from './refill-money/refill-step-two/refill-inner-transfer/refill-inner-transfer.component';
import {RefillFiatComponent} from './refill-money/refill-step-two/refill-fiat/refill-fiat.component';
import {RefillCryptoComponent} from './refill-money/refill-step-two/refill-crypto/refill-crypto.component';
import {RefillStepThreeComponent} from './refill-money/refill-step-three/refill-step-three.component';
import {RefillStepTwoComponent} from './refill-money/refill-step-two/refill-step-two.component';
import {RefillStepOneComponent} from './refill-money/refill-step-one/refill-step-one.component';
import {RefillMoneyComponent} from './refill-money/refill-money.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {QRCodeModule} from 'angular2-qrcode';

@NgModule({
  declarations: [
    BalanceComponent,
  CryptoBalancesComponent,
  FiatBalancesComponent,
  PendingRequestComponent,
    RefillMoneyComponent,
    RefillStepOneComponent,
    RefillStepTwoComponent,
    RefillStepThreeComponent,
    RefillCryptoComponent,
    RefillFiatComponent,
    RefillInnerTransferComponent,
  ],
  exports: [
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    QRCodeModule
  ],
  providers: [
  ]
})
export class BalanceModule {

}
