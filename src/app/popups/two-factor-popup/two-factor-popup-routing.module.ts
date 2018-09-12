import {NgModule} from '@angular/core';
import { GoogleStepOneComponent } from './google-step-one/google-step-one.component';
import { GoogleStepTwoComponent } from './google-step-two/google-step-two.component';
import { GoogleStepThreeComponent } from './google-step-three/google-step-three.component';
import { GoogleStepFourComponent } from './google-step-four/google-step-four.component';
import { SmsStepOneComponent } from './sms-step-one/sms-step-one.component';
import { SmsStepTwoComponent } from './sms-step-two/sms-step-two.component';
import { SmsStepThreeComponent } from './sms-step-three/sms-step-three.component';
import { SmsStepFourComponent } from './sms-step-four/sms-step-four.component';
import { TelegramStepOneComponent } from './telegram-step-one/telegram-step-one.component';
import { TelegramStepTwoComponent } from './telegram-step-two/telegram-step-two.component';
import { TelegramStepThreeComponent } from './telegram-step-three/telegram-step-three.component';
import { TelegramStepFourComponent } from './telegram-step-four/telegram-step-four.component';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from '../../settings/settings.component';
import {TwoFactorAuthenticationComponent} from '../../settings/two-factor-authenticaton/two-factor-authentication.component';
import {PasswordComponent} from '../../settings/password/password.component';
import {SessionComponent} from '../../settings/session/session.component';
import {NicknameComponent} from '../../settings/nickname/nickname.component';
import {VerificationComponent} from '../../settings/verification/verification.component';
import {EmailNotificationComponent} from '../../settings/email-notification/email-notification.component';
import {ViewComponent} from '../../settings/view/view.component';
import {TwoFactorPopupComponent} from './two-factor-popup.component';


const popupRoutes: Routes = [
  { path: 'two-fa-popup',
    component: TwoFactorPopupComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'google-one'},
      { path: 'google-one', component: GoogleStepOneComponent },
      { path: 'google-two', component: GoogleStepTwoComponent },
      { path: 'google-three', component: GoogleStepThreeComponent },
      { path: 'google-four', component: GoogleStepFourComponent },
      { path: 'sms-one', component: SmsStepOneComponent },
      { path: 'sms-two', component: SmsStepTwoComponent },
      { path: 'sms-three', component: SmsStepThreeComponent },
      { path: 'sms-four', component: SmsStepFourComponent },
      { path: 'telegram-one', component: TelegramStepOneComponent },
      { path: 'telegram-two', component: TelegramStepTwoComponent },
      { path: 'telegram-three', component: TelegramStepThreeComponent },
      { path: 'telegram-four', component: TelegramStepFourComponent },
    ]
  }
];


@NgModule({
  imports: [ RouterModule.forChild(popupRoutes) ],
  exports: [ RouterModule ]
})
export class TwoFactorPopupRoutingModule {

}
