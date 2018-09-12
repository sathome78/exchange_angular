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
import { TwoFactorPopupRoutingModule } from './two-factor-popup-routing.module';

@NgModule({
  imports: [
    TwoFactorPopupRoutingModule
  ],
  declarations: [
    GoogleStepOneComponent,
    GoogleStepTwoComponent,
    GoogleStepThreeComponent,
    GoogleStepFourComponent,
    SmsStepOneComponent,
    SmsStepTwoComponent,
    SmsStepThreeComponent,
    SmsStepFourComponent,
    TelegramStepOneComponent,
    TelegramStepTwoComponent,
    TelegramStepThreeComponent,
    TelegramStepFourComponent
  ],
  providers: [

  ]
})
export class TwoFactorPopupModule {

}
