import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreecoinsComponent } from './freecoins.component';
import { FreecoinsPopupComponent } from './freecoins-popup/freecoins-popup.component';
import { FreecoinsPopupStepOneComponent } from './freecoins-popup/freecoins-popup-step-one/freecoins-popup-step-one.component';
import { FreecoinsPopupStepTwoComponent } from './freecoins-popup/freecoins-popup-step-two/freecoins-popup-step-two.component';
import { FreecoinsPopupStepThreeComponent } from './freecoins-popup/freecoins-popup-step-three/freecoins-popup-step-three.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';
import { MomentModule } from 'ngx-moment';
import { SharedModule } from 'app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { translateInfo } from '../shared/configs/translate-options';
import { FreecoinsService } from './freecoins.service';
import { RouterModule, Routes } from '@angular/router';
import { FreecoinsCaptchaComponent } from './freecoins-captcha/freecoins-captcha.component';
import { FreeCoinStatePipe } from './freecoins-state.pipe';
import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';
import { JwtInterceptor } from 'app/core/interceptors/jwt.interceptor';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.freecoins, translateInfo.suffix);
}

const routes: Routes = [
  {
    path: '',
    component: FreecoinsComponent,
  },
];

@NgModule({
  declarations: [
    FreecoinsComponent,
    FreecoinsPopupComponent,
    FreecoinsPopupStepOneComponent,
    FreecoinsPopupStepTwoComponent,
    FreecoinsPopupStepThreeComponent,
    FreecoinsCaptchaComponent,
    FreeCoinStatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MyDatePickerModule,
    MomentModule,
    SharedModule,
    ScrollingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    RouterModule.forChild(routes),
  ],
  providers: [
    FreecoinsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class FreecoinsModule { }
