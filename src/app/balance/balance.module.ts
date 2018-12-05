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
import {SendInnerTransferComponent} from './send-money/send-step-two/send-inner-transfer/send-inner-transfer.component';
import {SendStepOneComponent} from './send-money/send-step-one/send-step-one.component';
import {SendStepThreeComponent} from './send-money/send-step-three/send-step-three.component';
import {SendMoneyComponent} from './send-money/send-money.component';
import {SendCryptoComponent} from './send-money/send-step-two/send-crypto/send-crypto.component';
import {SendFiatComponent} from './send-money/send-step-two/send-fiat/send-fiat.component';
import {SendStepTwoComponent} from './send-money/send-step-two/send-step-two.component';
import {TransferProtectedEmailCodeComponent} from './send-money/send-step-three/transfer-protected-email-code/transfer-protected-email-code.component';
import {TransferProtectedCodeComponent} from './send-money/send-step-three/transfer-protected-code/transfer-protected-code.component';
import {TransferInstantComponent} from './send-money/send-step-three/transfer-instant/transfer-instant.component';

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
    SendMoneyComponent,
    SendStepOneComponent,
    SendStepTwoComponent,
    SendStepThreeComponent,
    SendCryptoComponent,
    SendFiatComponent,
    SendInnerTransferComponent,
    TransferInstantComponent,
    TransferProtectedCodeComponent,
    TransferProtectedEmailCodeComponent,
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
