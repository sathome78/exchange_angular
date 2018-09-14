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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule
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
