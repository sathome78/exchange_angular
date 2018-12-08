import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {MyDatePickerModule} from 'mydatepicker';
import {EffectsModule} from '@ngrx/effects';
import {NgSelectModule} from '@ng-select/ng-select';
import {AuthInterceptor} from '../core/interceptors/auth.interceptor';
import {JwtInterceptor} from '../core/interceptors/jwt.interceptor';
import {FundsEffects} from './store/effects/funds.effects';
import {reducer} from './store/reducers/funds.reducer';
import {FundsComponent} from './funds.component';
import {FundsRoutingModule} from './funds.routing';
import {BalanceComponent} from './balance/balance.component';
import {CryptoBalanceTableComponent} from './balance/crypto-balance-table/crypto-balance-table.component';
import {FiatBalanceTableComponent} from './balance/fiat-balance-table/fiat-balance-table.component';
import {PendingRequestTableComponent} from './balance/pending-request-table/pending-request-table.component';
import {SharedModule} from '../shared/shared.module';

import {RefillMoneyComponent} from './balance/refill-money/refill-money.component';
import {RefillStepOneComponent} from './balance/refill-money/refill-step-one/refill-step-one.component';
import {RefillStepTwoComponent} from './balance/refill-money/refill-step-two/refill-step-two.component';
import {RefillStepThreeComponent} from './balance/refill-money/refill-step-three/refill-step-three.component';
import {RefillCryptoComponent} from './balance/refill-money/refill-step-two/refill-crypto/refill-crypto.component';
import {RefillFiatComponent} from './balance/refill-money/refill-step-two/refill-fiat/refill-fiat.component';
import {RefillInnerTransferComponent} from './balance/refill-money/refill-step-two/refill-inner-transfer/refill-inner-transfer.component';
import {SendMoneyComponent} from './balance/send-money/send-money.component';
import {SendStepOneComponent} from './balance/send-money/send-step-one/send-step-one.component';
import {SendStepTwoComponent} from './balance/send-money/send-step-two/send-step-two.component';
import {SendStepThreeComponent} from './balance/send-money/send-step-three/send-step-three.component';
import {SendCryptoComponent} from './balance/send-money/send-step-two/send-crypto/send-crypto.component';
import {SendFiatComponent} from './balance/send-money/send-step-two/send-fiat/send-fiat.component';
import {TransferInstantComponent} from './balance/send-money/send-step-three/transfer-instant/transfer-instant.component';
import {SendInnerTransferComponent} from './balance/send-money/send-step-two/send-inner-transfer/send-inner-transfer.component';
import {TransferProtectedCodeComponent} from './balance/send-money/send-step-three/transfer-protected-code/transfer-protected-code.component';
import {TransferProtectedEmailCodeComponent} from './balance/send-money/send-step-three/transfer-protected-email-code/transfer-protected-email-code.component';
import {SendTfaComponent} from './balance/send-money/send-step-three/send-tfa/send-tfa.component';
import {SendSuccessfulComponent} from './balance/send-money/send-successful/send-successful.component';

import {BalanceService} from './services/balance.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MyDatePickerModule,
    NgSelectModule,
    SharedModule,
    EffectsModule.forRoot([FundsEffects]),
    StoreModule.forFeature('funds', reducer),
    FundsRoutingModule,
  ],
  declarations: [
    FundsComponent,
    BalanceComponent,
    CryptoBalanceTableComponent,
    FiatBalanceTableComponent,
    PendingRequestTableComponent,

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
    SendTfaComponent,
    SendSuccessfulComponent,
  ],
  providers: [
    BalanceService,

    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ]
})
export class FundsModule {

}
