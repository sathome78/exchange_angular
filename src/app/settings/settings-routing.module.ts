import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authenticaton/two-factor-authentication.component';
import { PasswordComponent } from './password/password.component';
import { SessionComponent } from './session/session.component';
import { NicknameComponent } from './nickname/nickname.component';
import { VerificationComponent } from './verification/verification.component';
import { EmailNotificationComponent } from './email-notification/email-notification.component';
import { ViewComponent } from './view/view.component';
import { ApiKeysComponent } from './api-keys/api-keys.component';

const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'two-factor-auth' },
      { path: 'two-factor-auth', component: TwoFactorAuthenticationComponent },
      { path: 'password', component: PasswordComponent },
      { path: 'session', component: SessionComponent },
      // { path: 'nickname', component: NicknameComponent },
      { path: 'verification', component: VerificationComponent },
      { path: 'api-keys', component: ApiKeysComponent },
      // { path: 'e-notification', component: EmailNotificationComponent },
      // { path: 'view', component: ViewComponent },
      { path: '**', redirectTo: 'two-factor-auth' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
  
}
