import { NgModule } from '@angular/core';
import { EmailNotificationComponent } from './email-notification/email-notification.component';
import { NicknameComponent } from './nickname/nickname.component';
import { PasswordComponent } from './password/password.component';
import { SessionComponent } from './session/session.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authenticaton/two-factor-authentication.component';
import { VerificationComponent } from './verification/verification.component';
import { ViewComponent } from './view/view.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { CommonModule } from '@angular/common';
import { SettingsService } from './settings.service';
import { SettingsComponent } from './settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { translateInfo } from '../shared/configs/translate-options';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoreEffects } from 'app/core/effects/core.effects';
import { SettingsEffects } from './store/effects/settings.effects';
import { reducer } from './store/reducers/settings.reducer';
import { SharedModule } from 'app/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { ApiKeysComponent } from './api-keys/api-keys.component';
import { ApiKeyCreatedComponent } from './api-keys/api-key-created/api-key-created.component';
import { ApiKeyPopupComponent } from './api-keys/api-key-popup/api-key-popup.component';
import { ApiKeysService } from './api-keys/api-keys.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MomentModule } from 'ngx-moment';

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
    MyDatePickerModule,
    NgxPaginationModule,
    ScrollingModule,
    MomentModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    EffectsModule.forRoot([CoreEffects, SettingsEffects]),
    StoreModule.forFeature('settings', reducer),
  ],
  declarations: [
    EmailNotificationComponent,
    NicknameComponent,
    PasswordComponent,
    SessionComponent,
    SettingsComponent,
    TwoFactorAuthenticationComponent,
    VerificationComponent,
    ViewComponent,
    ApiKeysComponent,
    ApiKeyCreatedComponent,
    ApiKeyPopupComponent,
  ],
  providers: [SettingsService, ApiKeysService],
})
export class SettingsModule {}
