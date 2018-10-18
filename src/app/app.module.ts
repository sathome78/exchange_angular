import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {DropdownDirective} from './directives/dropdown.directive';
import {AuthGuard} from './services/auth.guard';
import {AuthService} from './services/auth.service';
import {FooterComponent} from './footer/footer.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {SettingsModule} from './settings/settings.module';
import {PopupService} from './services/popup.service';
import {TwoFactorPopupComponent} from './popups/two-factor-popup/two-factor-popup.component';
import {LoggingService} from './services/logging.service';
import {GoogleStepOneComponent} from './popups/two-factor-popup/google/google-step-one/google-step-one.component';
import {GoogleStepTwoComponent} from './popups/two-factor-popup/google/google-step-two/google-step-two.component';
import {GoogleStepThreeComponent} from './popups/two-factor-popup/google/google-step-three/google-step-three.component';
import {GoogleStepFourComponent} from './popups/two-factor-popup/google/google-step-four/google-step-four.component';
import {SmsStepOneComponent} from './popups/two-factor-popup/sms/sms-step-one/sms-step-one.component';
import {SmsStepTwoComponent} from './popups/two-factor-popup/sms/sms-step-two/sms-step-two.component';
import {TelegramStepOneComponent} from './popups/two-factor-popup/telegram/telegram-step-one/telegram-step-one.component';
import {TelegramStepTwoComponent} from './popups/two-factor-popup/telegram/telegram-step-two/telegram-step-two.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IdentityPopupComponent } from './popups/identity-popup/identity-popup.component';
import { StepOneComponent } from './popups/identity-popup/step-one/step-one.component';
import { StepTwoComponent } from './popups/identity-popup/step-two/step-two.component';
import { StepThreeComponent } from './popups/identity-popup/step-three/step-three.component';
import { StepFourComponent } from './popups/identity-popup/step-four/step-four.component';
import { LoginPopupComponent } from './popups/login-popup/login-popup.component';
import { MyDatePickerModule } from 'mydatepicker';
import {WebcamModule} from 'ngx-webcam';
import { WebcamComponent } from './popups/identity-popup/webcam/webcam.component';
import { DocUploadComponent } from './popups/identity-popup/doc-upload/doc-upload.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LangService} from './services/lang.service';
import {UserService} from './services/user.service';
import {ThemeService} from './services/theme.service';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {QRCodeModule} from 'angular2-qrcode';
import {GoogleAuthenticatorService} from './popups/two-factor-popup/google/google-authenticator.service';
import { SharedModule } from './shared/shared.module';
import {UserVerificationService} from './services/user-verification.service';
import { OpenOrdersComponent } from './orders/open-orders/open-orders.component';
import { OrdersHistoryComponent } from './orders/orders-history/orders-history.component';
import {MockDataService} from './services/mock-data.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
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
    OpenOrdersComponent,
    OrdersHistoryComponent,
    // TWO FACTOR POPUP END


  ],
  imports: [
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
    SharedModule
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

    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
