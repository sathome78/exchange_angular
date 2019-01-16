import {NgModule} from '@angular/core';
import {EmailNotificationComponent} from './email-notification/email-notification.component';
import {NicknameComponent} from './nickname/nickname.component';
import {PasswordComponent} from './password/password.component';
import {SessionComponent} from './session/session.component';
import {TwoFactorAuthenticationComponent} from './two-factor-authenticaton/two-factor-authentication.component';
import {VerificationComponent} from './verification/verification.component';
import {ViewComponent} from './view/view.component';
import {SettingsRoutingModule} from './settings-routing.module';
import {CommonModule} from '@angular/common';
import {SettingsService} from './settings.service';
import {SettingsComponent} from './settings.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng5SliderModule} from 'ng5-slider';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {translateInfo} from '../shared/configs/translate-options';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.settings, translateInfo.suffix);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng5SliderModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
  ],
  declarations: [
    EmailNotificationComponent,
    NicknameComponent,
    PasswordComponent,
    SessionComponent,
    SettingsComponent,
    TwoFactorAuthenticationComponent,
    VerificationComponent,
    ViewComponent
  ],
  providers: [
    SettingsService
  ]
})
export class SettingsModule {

}
