import {NgModule} from '@angular/core';
import {LoginPopupMobileComponent} from './login-popup-mobile/login-popup-mobile.component';
import {PopupsComponent} from './popups.component';
import {CommonModule} from '@angular/common';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {RegistrationMobilePopupComponent} from './registration-mobile-popup/registration-mobile-popup.component';
import {RecoveryPassComponent} from './recovery-pass/recovery-pass.component';
import {RestoredPasswordPopupComponent} from './restored-password-popup/restored-password-popup.component';
import {RouterModule} from '@angular/router';
import {AlreadyRegisteredPopupComponent} from './already-registered-popup/already-registered-popup.component';
import {SessionExpiredPopupComponent} from './session-expired-popup/session-expired-popup.component';
import {AlreadyRestoredPasswordPopupComponent} from './already-restored-password-popup/already-restored-password-popup.component';
import {SessionTimeSavedPopupComponent} from './session-time-saved-popup/session-time-saved-popup.component';
import {PasswordChangedPopupComponent} from './password-changed-popup/password-changed-popup.component';
import {DemoTradingPopupComponent} from './demo-trading-popup/demo-trading-popup.component';
import {PopupInfoComponent} from './popup-info/popup-info.component';

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
    PopupInfoComponent,
    AlreadyRestoredPasswordPopupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
  ],
  providers: [

  ],
  exports: [
    PopupsComponent,
    ]
})
export class PopupsModule {}
