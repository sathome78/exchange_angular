import { NgModule } from '@angular/core';
import { LoginPopupMobileComponent } from './login-popup-mobile/login-popup-mobile.component';
import { PopupsComponent } from './popups.component';
import { CommonModule } from '@angular/common';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { createTranslateLoader } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RegistrationMobilePopupComponent } from './registration-mobile-popup/registration-mobile-popup.component';
import { RecoveryPassComponent } from './recovery-pass/recovery-pass.component';
import { RestoredPasswordPopupComponent } from './restored-password-popup/restored-password-popup.component';
import { RouterModule } from '@angular/router';
import { AlreadyRegisteredPopupComponent } from './already-registered-popup/already-registered-popup.component';
import { SessionExpiredPopupComponent } from './session-expired-popup/session-expired-popup.component';
import { AlreadyRestoredPasswordPopupComponent } from './already-restored-password-popup/already-restored-password-popup.component';
import { SessionTimeSavedPopupComponent } from './session-time-saved-popup/session-time-saved-popup.component';
import { PasswordChangedPopupComponent } from './password-changed-popup/password-changed-popup.component';
import { DemoTradingPopupComponent } from './demo-trading-popup/demo-trading-popup.component';
import { PopupInfoComponent } from './popup-info/popup-info.component';
import { KycPopupComponent } from './kyc-popup/kyc-popup.component';
import { KycLevel1StepTwoComponent } from './kyc-popup/kyc-level1-step-two/kyc-level1-step-two.component';
import { KycLevel1StepOneComponent } from './kyc-popup/kyc-level1-step-one/kyc-level1-step-one.component';
import { IdentityPopupComponent } from './identity-popup/identity-popup.component';
import { StepOneComponent } from './identity-popup/step-one/step-one.component';
import { StepTwoComponent } from './identity-popup/step-two/step-two.component';
import { StepThreeComponent } from './identity-popup/step-three/step-three.component';
import { StepFourComponent } from './identity-popup/step-four/step-four.component';
import { DocUploadComponent } from './identity-popup/doc-upload/doc-upload.component';
import { WebcamComponent } from './identity-popup/webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam';
import { TwoFactorPopupComponent } from './two-factor-popup/two-factor-popup.component';
import { GoogleStepOneComponent } from './two-factor-popup/google/google-step-one/google-step-one.component';
import { GoogleStepTwoComponent } from './two-factor-popup/google/google-step-two/google-step-two.component';
import { GoogleStepThreeComponent } from './two-factor-popup/google/google-step-three/google-step-three.component';
import { GoogleStepFourComponent } from './two-factor-popup/google/google-step-four/google-step-four.component';
import { SmsStepOneComponent } from './two-factor-popup/sms/sms-step-one/sms-step-one.component';
import { SmsStepTwoComponent } from './two-factor-popup/sms/sms-step-two/sms-step-two.component';
import { TelegramStepOneComponent } from './two-factor-popup/telegram/telegram-step-one/telegram-step-one.component';
import { TelegramStepTwoComponent } from './two-factor-popup/telegram/telegram-step-two/telegram-step-two.component';
import { GoogleDisableComponent } from './two-factor-popup/google/google-disable/google-disable.component';
import { ThankYouPopupComponent } from './thank-you-popup/thank-you-popup.component';
import { TopNotificationComponent } from './notifications-list/top-notification/top-notification.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NewsSubscribePopupComponent } from './news-subscribe-popup/news-subscribe-popup.component';
import { NewsThankYouPopupComponent } from './news-thank-you-popup/news-thank-you-popup.component';
import { TopNotificationReportComponent } from './notifications-list/top-notification-report/top-notification-report.component';
import { QuberaPopupsComponent } from './qubera-popups/qubera-popups.component';

@NgModule({
  declarations: [
    PopupsComponent,
    LoginPopupMobileComponent,
    RecoveryPassComponent,
    SessionExpiredPopupComponent,
    RestoredPasswordPopupComponent,
    AlreadyRegisteredPopupComponent,
    RegistrationMobilePopupComponent,
    SessionTimeSavedPopupComponent,
    PasswordChangedPopupComponent,
    DemoTradingPopupComponent,
    TwoFactorPopupComponent,
    PopupInfoComponent,
    KycPopupComponent,
    KycLevel1StepTwoComponent,
    KycLevel1StepOneComponent,
    IdentityPopupComponent,
    AlreadyRestoredPasswordPopupComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    DocUploadComponent,
    WebcamComponent,
    GoogleStepOneComponent,
    GoogleStepTwoComponent,
    GoogleStepThreeComponent,
    GoogleStepFourComponent,
    SmsStepOneComponent,
    SmsStepTwoComponent,
    TelegramStepOneComponent,
    TelegramStepTwoComponent,
    GoogleDisableComponent,
    ThankYouPopupComponent,
    TopNotificationComponent,
    NotificationsListComponent,
    NewsSubscribePopupComponent,
    NewsThankYouPopupComponent,
    TopNotificationReportComponent,
    QuberaPopupsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    WebcamModule,
    RouterModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: createTranslateLoader,
    //     deps: [HttpClient],
    //   },
    //   isolate: true,
    // }),
  ],
  providers: [],
  exports: [PopupsComponent],
  entryComponents: [TopNotificationComponent, TopNotificationReportComponent],
})
export class PopupsModule {}
