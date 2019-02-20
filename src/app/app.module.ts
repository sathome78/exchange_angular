import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
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
import {reducers} from './core/reducers';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {MyDatePickerModule} from 'mydatepicker';
import {SettingsModule} from './settings/settings.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from './shared/shared.module';
import {WebcamModule} from 'ngx-webcam';
import {AuthGuard} from './shared/guards/auth.guard';
import {GoogleAuthenticatorService} from './popups/two-factor-popup/google/google-authenticator.service';
import {PopupService} from './shared/services/popup.service';
import {AuthService} from './shared/services/auth.service';
import {LangService} from './shared/services/lang.service';
import {LoggingService} from './shared/services/logging.service';
import {UserService} from './shared/services/user.service';
import {UserVerificationService} from './shared/services/user-verification.service';
import {ThemeService} from './shared/services/theme.service';
import {MockDataService} from './shared/services/mock-data.service';
import {EmbeddedOrdersService} from './dashboard/components/embedded-orders/embedded-orders.service';
import {JwtInterceptor} from './core/interceptors/jwt.interceptor';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {RecoveryPassComponent} from './popups/recovery-pass/recovery-pass.component';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from 'environments/environment';
import {DemoTradingPopupComponent} from './popups/demo-trading-popup/demo-trading-popup.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CoreService} from './core/services/core.service';
import {ThankYouPopupComponent} from './popups/thank-you-popup/thank-you-popup.component';
import {translateInfo} from './shared/configs/translate-options';
import {AlreadyRestoredPasswordPopupComponent} from './popups/already-restored-password-popup/already-restored-password-popup.component';
import {AlreadyRegisteredPopupComponent} from './popups/already-registered-popup/already-registered-popup.component';
import {RestoredPasswordPopupComponent} from './popups/restored-password-popup/restored-password-popup.component';
import {SessionTimeSavedPopupComponent} from './popups/session-time-saved-popup/session-time-saved-popup.component';
import {PasswordChangedPopupComponent} from './popups/password-changed-popup/password-changed-popup.component';
import {KycPopupComponent} from './popups/kyc-popup/kyc-popup.component';
import {KycLevel1StepTwoComponent} from './popups/kyc-popup/kyc-level1-step-two/kyc-level1-step-two.component';
import {KycLevel1StepOneComponent} from './popups/kyc-popup/kyc-level1-step-one/kyc-level1-step-one.component';
import {PopupInfoComponent} from './popups/popup-info/popup-info.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FinalRegistrationComponent} from './popups/final-registration/final-registration.component';
import {FinalStepRecoveryPasswordComponent} from './popups/final-step-recovery-password/final-step-recovery-password.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.main, translateInfo.suffix);
}


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
    FinalStepRecoveryPasswordComponent,
    SessionTimeSavedPopupComponent,

    PasswordChangedPopupComponent,

    DemoTradingPopupComponent,
    AlreadyRegisteredPopupComponent,
    ThankYouPopupComponent,
    AlreadyRestoredPasswordPopupComponent,
    RestoredPasswordPopupComponent,
    KycPopupComponent,
    KycLevel1StepTwoComponent,
    KycLevel1StepOneComponent,
    PopupInfoComponent,
    // TWO FACTOR POPUP END

  ],
  imports: [
    StoreModule.forRoot(reducers),
    ScrollingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
    CoreModule,
    AppRoutingModule,
    BrowserModule,
    DashboardModule,
    HttpClientModule,
    FormsModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    SettingsModule,
    WebcamModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    GoogleAuthenticatorService,
    LangService,
    LoggingService,
    PopupService,
    UserService,
    UserVerificationService,
    ThemeService,
    MockDataService,
    EmbeddedOrdersService,
    CoreService,

    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    // {provide: LOCALE_ID, useValue: 'ru-RU'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
