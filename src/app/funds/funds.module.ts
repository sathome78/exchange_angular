import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';
import { EffectsModule } from '@ngrx/effects';
import { AuthInterceptor } from '../core/interceptors/auth.interceptor';
import { JwtInterceptor } from '../core/interceptors/jwt.interceptor';
import { FundsEffects } from './store/effects/funds.effects';
import { reducer } from './store/reducers/funds.reducer';
import { FundsComponent } from './funds.component';
import { FundsRoutingModule } from './funds.routing';
import { BalanceComponent } from './balance/balance.component';
import { PendingRequestTableComponent } from './balance/pending-request-table/pending-request-table.component';
import { SharedModule } from '../shared/shared.module';

import { RefillMoneyComponent } from './balance/refill-money/refill-money.component';
import { RefillStepOneComponent } from './balance/refill-money/refill-step-one/refill-step-one.component';
import { RefillStepTwoComponent } from './balance/refill-money/refill-step-two/refill-step-two.component';
import { RefillCryptoComponent } from './balance/refill-money/refill-step-two/refill-crypto/refill-crypto.component';
import { RefillFiatComponent } from './balance/refill-money/refill-step-two/refill-fiat/refill-fiat.component';
import { RefillInnerTransferComponent } from './balance/refill-money/refill-step-two/refill-inner-transfer/refill-inner-transfer.component';
import { SendMoneyComponent } from './balance/send-money/send-money.component';
import { SendStepOneComponent } from './balance/send-money/send-step-one/send-step-one.component';
import { SendStepTwoComponent } from './balance/send-money/send-step-two/send-step-two.component';
import { SendStepThreeComponent } from './balance/send-money/send-step-three/send-step-three.component';
import { SendCryptoComponent } from './balance/send-money/send-step-two/send-crypto/send-crypto.component';
import { SendFiatComponent } from './balance/send-money/send-step-two/send-fiat/send-fiat.component';
import { TransferInstantComponent } from './balance/send-money/send-step-three/transfer-instant/transfer-instant.component';
import { SendInnerTransferComponent } from './balance/send-money/send-step-two/send-inner-transfer/send-inner-transfer.component';
import { TransferProtectedCodeComponent } from './balance/send-money/send-step-three/transfer-protected-code/transfer-protected-code.component';
import { TransferProtectedEmailCodeComponent } from './balance/send-money/send-step-three/transfer-protected-email-code/transfer-protected-email-code.component';
import { SendTfaComponent } from './balance/send-money/send-step-three/send-tfa/send-tfa.component';
import { SendSuccessfulComponent } from './balance/send-money/send-successful/send-successful.component';

import { BalanceService } from './services/balance.service';
import { BalanceTableComponent } from './balance/balance-table/balance-table.component';
import { BalanceMobComponent } from './balance/balance-mob/balance-mob.component';
import { PendingRequestMobComponent } from './pending-request-mob/pending-request-mob.component';
import { BalanceDetailsComponent } from './balance-details/balance-details.component';
import { PendingRequestDetailsComponent } from './pending-request-details/pending-request-details.component';
import { PendingRequestInfoComponent } from './pending-request-info/pending-request-info.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionsService } from './services/transaction.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { translateInfo } from '../shared/configs/translate-options';
import { MomentModule } from 'ngx-moment';
import { CoreEffects } from '../core/effects/core.effects';
import { ShowPendingStatusPipe } from './pending-status.pipe';
import { ShowPendingSystemPipe } from './pending-system.pipe';
import { ShowTransactionsStatusPipe } from './transactions-history-status.pipe';
import { ShowTransactionsTypePipe } from './transactions-history-type.pipe';
import { QuberaTableComponent } from './balance/qubera-table/qubera-table.component';
import { SendFiatQuberaComponent } from './balance/send-money/send-step-two/send-fiat-qubera/send-fiat-qubera.component';
import { TransferQuberaComponent } from './balance/send-money/send-step-three/transfer-qubera/transfer-qubera.component';
import { IEOTableComponent } from './balance/ieotable/ieotable.component';
import { BalanceSearchMobComponent } from './balance/balance-search-mob/balance-search-mob.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IEOTableMobComponent } from './balance/ieo-table-mob/ieo-table-mob.component';
import { IEOBalanceDetailsComponent } from './ieo-balance-details/ieo-balance-details.component';
import { BalanceTableTradeBtnComponent } from './balance/balance-table/balance-table-trade-btn/balance-table-trade-btn.component';
import { QuberaPopupComponent } from './balance/qubera-popup/qubera-popup.component';
import { DepositComponent } from './balance/qubera-popup/deposit/deposit.component';
import { TransferComponent } from './balance/qubera-popup/transfer/transfer.component';
import { WithdrawComponent } from './balance/qubera-popup/withdraw/withdraw.component';
import { QuberaKycComponent } from './balance/qubera-popup/qubera-kyc/qubera-kyc.component';
import { StepOneComponent } from './balance/qubera-popup/qubera-kyc/step-one/step-one.component';
import { StepTwoComponent } from './balance/qubera-popup/qubera-kyc/step-two/step-two.component';
import { StepOneDepositComponent } from './balance/qubera-popup/deposit/step-one-deposit/step-one-deposit.component';
import { StepOneWithdrawComponent } from './balance/qubera-popup/withdraw/step-one-withdraw/step-one-withdraw.component';
import { StepTwoWithdrawComponent } from './balance/qubera-popup/withdraw/step-two-withdraw/step-two-withdraw.component';
import { QuberaMobComponent } from './balance/qubera-mob/qubera-mob.component';
import { CreateQuberaComponent } from './balance/qubera-popup/create-qubera/create-qubera.component';
import { StepOneQuberaComponent } from './balance/qubera-popup/create-qubera/step-one-qubera/step-one-qubera.component';
import { StepTwoQuberaComponent } from './balance/qubera-popup/create-qubera/step-two-qubera/step-two-qubera.component';
import { RefillStepThreeComponent } from './balance/refill-money/refill-step-three/refill-step-three.component';
import { StepThreeWithdrawComponent } from './balance/qubera-popup/withdraw/step-three-withdraw/step-three-withdraw.component';
import { QuberaMobDetailsComponent } from './qubera-mob-details/qubera-mob-details.component';
import { HashToUrlPipe } from './hash-to-url.pipe';
import { RefillCoinPayComponent } from './balance/refill-money/refill-step-two/refill-fiat/refill-coin-pay/refill-coin-pay.component';
import { NeedKycMsgComponent } from './components/need-kyc-msg/need-kyc-msg.component';
import { CommissionComponent } from './components/commission/commission.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.funds, translateInfo.suffix);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MyDatePickerModule,
    MomentModule,
    SharedModule,
    ScrollingModule,
    EffectsModule.forRoot([CoreEffects, FundsEffects]),
    StoreModule.forFeature('funds', reducer),
    FundsRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  declarations: [
    FundsComponent,
    BalanceComponent,
    PendingRequestTableComponent,

    RefillMoneyComponent,
    RefillStepOneComponent,
    RefillStepTwoComponent,
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
    BalanceTableComponent,
    BalanceMobComponent,
    PendingRequestMobComponent,
    BalanceDetailsComponent,
    PendingRequestDetailsComponent,
    PendingRequestInfoComponent,

    TransactionHistoryComponent,
    ShowPendingStatusPipe,
    ShowPendingSystemPipe,
    ShowTransactionsStatusPipe,
    ShowTransactionsTypePipe,
    HashToUrlPipe,
    QuberaTableComponent,
    SendFiatQuberaComponent,
    TransferQuberaComponent,
    IEOTableComponent,
    BalanceSearchMobComponent,
    IEOTableMobComponent,
    IEOBalanceDetailsComponent,
    BalanceTableTradeBtnComponent,
    QuberaPopupComponent,
    DepositComponent,
    TransferComponent,
    WithdrawComponent,
    QuberaKycComponent,
    StepOneComponent,
    StepTwoComponent,
    StepOneDepositComponent,
    StepOneWithdrawComponent,
    StepTwoWithdrawComponent,
    QuberaMobComponent,
    CreateQuberaComponent,
    StepOneQuberaComponent,
    StepTwoQuberaComponent,
    RefillStepThreeComponent,
    StepThreeWithdrawComponent,
    QuberaMobDetailsComponent,
    RefillCoinPayComponent,
    NeedKycMsgComponent,
    CommissionComponent,
  ],
  providers: [
    BalanceService,
    TransactionsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class FundsModule {}
