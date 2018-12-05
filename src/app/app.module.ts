import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import { AppComponent } from './app.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './header/header.component';
import {TwoFactorPopupComponent} from './popups/two-factor-popup/two-factor-popup.component';
import {FooterComponent} from './footer/footer.component';
import {GoogleDisableComponent} from './popups/two-factor-popup/google/google-disable/google-disable.component';
import {GoogleStepOneComponent} from './popups/two-factor-popup/google/google-step-one/google-step-one.component';
import {GoogleStepTwoComponent} from './popups/two-factor-popup/google/google-step-two/google-step-two.component';
import {GoogleStepThreeComponent} from './popups/two-factor-popup/google/google-step-three/google-step-three.component';
import {GoogleStepFourComponent} from './popups/two-factor-popup/google/google-step-four/google-step-four.component';
import {SmsStepOneComponent} from './popups/two-factor-popup/sms/sms-step-one/sms-step-one.component';
import {SmsStepTwoComponent} from './popups/two-factor-popup/sms/sms-step-two/sms-step-two.component';
import {TelegramStepOneComponent} from './popups/two-factor-popup/telegram/telegram-step-one/telegram-step-one.component';
import {TelegramStepTwoComponent} from './popups/two-factor-popup/telegram/telegram-step-two/telegram-step-two.component';
import {IdentityPopupComponent} from './popups/identity-popup/identity-popup.component';
import {StepOneComponent} from './popups/identity-popup/step-one/step-one.component';
import {StepTwoComponent} from './popups/identity-popup/step-two/step-two.component';
import {StepThreeComponent} from './popups/identity-popup/step-three/step-three.component';
import {StepFourComponent} from './popups/identity-popup/step-four/step-four.component';
import {LoginPopupComponent} from './popups/login-popup/login-popup.component';
import {WebcamComponent} from './popups/identity-popup/webcam/webcam.component';
import {DocUploadComponent} from './popups/identity-popup/doc-upload/doc-upload.component';
import {ReferralStructureComponent} from './referral/referral-structure/referral-structure.component';
import {ReferralChargesComponent} from './referral/referral-charges/referral-charges.component';
import {RegistrationMobilePopupComponent} from './popups/registration-mobile-popup/registration-mobile-popup.component';
import {LoginPopupMobileComponent} from './popups/login-popup-mobile/login-popup-mobile.component';
import {BalanceComponent} from './funds/balance/balance.component';
import {reducers} from './core/reducers';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {MyDatePickerModule} from 'mydatepicker';
import {QRCodeModule} from 'angular2-qrcode';
import {SettingsModule} from './settings/settings.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from './shared/shared.module';
import {WebcamModule} from 'ngx-webcam';
import {AuthGuard} from './shared/services/auth.guard';
import {GoogleAuthenticatorService} from './popups/two-factor-popup/google/google-authenticator.service';
import {PopupService} from './shared/services/popup.service';
import {AuthService} from './shared/services/auth.service';
import {LangService} from './shared/services/lang.service';
import {LoggingService} from './shared/services/logging.service';
import {UserService} from './shared/services/user.service';
import {UserVerificationService} from './shared/services/user-verification.service';
import {ThemeService} from './shared/services/theme.service';
import {MockDataService} from './shared/services/mock-data.service';
import {TradingService} from './dashboard/components/trading/trading.service';
import {EmbeddedOrdersService} from './dashboard/components/embedded-orders/embedded-orders.service';
import {CurrencyPairInfoService} from './dashboard/components/currency-pair-info/currency-pair-info.service';
import {JwtInterceptor} from './core/interceptors/jwt.interceptor';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {RecaptchaModule} from 'ng-recaptcha';
import {FinalRegistrationComponent} from './auth/final-registration/final-registration.component';
import { RecoveryPassComponent } from './popups/recovery-pass/recovery-pass.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { FinalStepRecoveryPasswordComponent } from './auth/final-step-recovery-password/final-step-recovery-password.component';
import { FundsComponent } from './funds/funds.component';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from 'environments/environment';
import {BalanceService} from './shared/services/balance.service';
import {RefillStepTwoComponent} from './funds/balance/refill-money/refill-step-two/refill-step-two.component';
import {TransferInstantComponent} from './funds/balance/send-money/send-step-three/transfer-instant/transfer-instant.component';
import {SendInnerTransferComponent} from './funds/balance/send-money/send-step-two/send-inner-transfer/send-inner-transfer.component';
import {FiatBalancesComponent} from './funds/balance/fiat-balances/fiat-balances.component';
import {RefillInnerTransferComponent} from './funds/balance/refill-money/refill-step-two/refill-inner-transfer/refill-inner-transfer.component';
import {PendingRequestComponent} from './funds/balance/pending-request/pending-request.component';
import {RefillMoneyComponent} from './funds/balance/refill-money/refill-money.component';
import {CryptoBalancesComponent} from './funds/balance/crypto-balances/crypto-balances.component';
import {SendFiatComponent} from './funds/balance/send-money/send-step-two/send-fiat/send-fiat.component';
import {RefillStepThreeComponent} from './funds/balance/refill-money/refill-step-three/refill-step-three.component';
import {SendStepThreeComponent} from './funds/balance/send-money/send-step-three/send-step-three.component';
import {RefillStepOneComponent} from './funds/balance/refill-money/refill-step-one/refill-step-one.component';
import {RefillFiatComponent} from './funds/balance/refill-money/refill-step-two/refill-fiat/refill-fiat.component';
import {TransferProtectedCodeComponent} from './funds/balance/send-money/send-step-three/transfer-protected-code/transfer-protected-code.component';
import {TransferProtectedEmailCodeComponent} from './funds/balance/send-money/send-step-three/transfer-protected-email-code/transfer-protected-email-code.component';
import {SendStepTwoComponent} from './funds/balance/send-money/send-step-two/send-step-two.component';
import {RefillCryptoComponent} from './funds/balance/refill-money/refill-step-two/refill-crypto/refill-crypto.component';
import {SendCryptoComponent} from './funds/balance/send-money/send-step-two/send-crypto/send-crypto.component';
import {SendMoneyComponent} from './funds/balance/send-money/send-money.component';
import {SendStepOneComponent} from './funds/balance/send-money/send-step-one/send-step-one.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TwoFactorPopupComponent,

    // TWO FACTOR POPUP START
    GoogleStepOneComponent,
    GoogleStepTwoComponent,
    GoogleStepThreeComponent,
    GoogleStepFourComponent,
    SmsStepOneComponent,
    SmsStepTwoComponent,
    TelegramStepOneComponent,
    TelegramStepTwoComponent,
    IdentityPopupComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    LoginPopupComponent,
    WebcamComponent,
    DocUploadComponent,
    ReferralStructureComponent,
    ReferralChargesComponent,
    LoginPopupMobileComponent,
    RegistrationMobilePopupComponent,
    GoogleDisableComponent,
    FinalRegistrationComponent,
    RecoveryPassComponent,
    TransactionHistoryComponent,
    FinalStepRecoveryPasswordComponent,
    FundsComponent,
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
    // TWO FACTOR POPUP END

  ],
  imports: [
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
    }),
    CoreModule,
    AppRoutingModule,
    BrowserModule,
    DashboardModule,
    HttpClientModule,
    FormsModule,
    MyDatePickerModule,
    QRCodeModule,
    ReactiveFormsModule,
    SettingsModule,
    WebcamModule,
    SharedModule,
    NgxPaginationModule,
    RecaptchaModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    BalanceService,
    GoogleAuthenticatorService,
    LangService,
    LoggingService,
    PopupService,
    UserService,
    UserVerificationService,
    ThemeService,
    MockDataService,
    TradingService,
    EmbeddedOrdersService,
    CurrencyPairInfoService,

    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    // {provide: LOCALE_ID, useValue: 'ru-RU'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
