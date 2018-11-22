import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TwoFactorAuthenticationComponent} from './two-factor-authenticaton/two-factor-authentication.component';
import {PasswordComponent} from './password/password.component';
import {SessionComponent} from './session/session.component';
import {NicknameComponent} from './nickname/nickname.component';
import {VerificationComponent} from './verification/verification.component';
import {EmailNotificationComponent} from './email-notification/email-notification.component';
import {ViewComponent} from './view/view.component';
import {AuthGuard} from '../services/auth.guard';

const settingsRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'two-factor-auth', },
  { path: 'two-factor-auth', component: TwoFactorAuthenticationComponent, canActivate: [AuthGuard] },
  { path: 'password', component: PasswordComponent, canActivate: [AuthGuard] },
  { path: 'session', component: SessionComponent, canActivate: [AuthGuard] },
  { path: 'nickname', component: NicknameComponent, canActivate: [AuthGuard] },
  // { path: 'verification', component: VerificationComponent, canActivate: [AuthGuard] },
  { path: 'e-notification', component: EmailNotificationComponent, canActivate: [AuthGuard] },
  { path: 'view', component: ViewComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'two-factor-auth' }
];

@NgModule({
  imports: [ RouterModule.forChild(settingsRoutes) ],
  exports: [ RouterModule ]
})

export class SettingsRoutingModule {
}
