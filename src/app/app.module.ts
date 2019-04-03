import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {ReferralStructureComponent} from './referral/referral-structure/referral-structure.component';
import {ReferralChargesComponent} from './referral/referral-charges/referral-charges.component';
import {reducers} from './core/reducers';
import {AppRoutingModule} from './app-routing.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {MyDatePickerModule} from 'mydatepicker';
import {SettingsModule} from './settings/settings.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from './shared/shared.module';
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
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from 'environments/environment';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CoreService} from './core/services/core.service';
import {translateInfo} from './shared/configs/translate-options';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FinalRegistrationComponent} from './popups/final-registration/final-registration.component';
import {FinalStepRecoveryPasswordComponent} from './popups/final-step-recovery-password/final-step-recovery-password.component';
import {PopupsModule} from './popups/popups.module';
import { IEOComponent } from './ieo/ieo.component';
import { PopupBuyComponent } from './ieo/components/popup-buy/popup-buy.component';
import { PopupNotificationComponent } from './ieo/components/popup-notification/popup-notification.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.main, translateInfo.suffix);
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ReferralStructureComponent,
    ReferralChargesComponent,
    FinalRegistrationComponent,
    FinalStepRecoveryPasswordComponent,
    IEOComponent,
    PopupBuyComponent,
    PopupNotificationComponent,
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
    AppRoutingModule,
    BrowserModule,
    DashboardModule,
    HttpClientModule,
    FormsModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    SettingsModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PopupsModule
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
