import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreecoinsComponent } from './freecoins.component';
import { FreecoinsPopupComponent } from './freecoins-popup/freecoins-popup.component';
import { FreecoinsPopupStepOneComponent } from './freecoins-popup/freecoins-popup-step-one/freecoins-popup-step-one.component';
import { FreecoinsPopupStepTwoComponent } from './freecoins-popup/freecoins-popup-step-two/freecoins-popup-step-two.component';
import { FreecoinsPopupStepThreeComponent } from './freecoins-popup/freecoins-popup-step-three/freecoins-popup-step-three.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';
import { MomentModule } from 'ngx-moment';
import { SharedModule } from 'app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { translateInfo } from '../shared/configs/translate-options';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.freecoins, translateInfo.suffix);
}

@NgModule({
  declarations: [
    FreecoinsComponent,
    FreecoinsPopupComponent,
    FreecoinsPopupStepOneComponent,
    FreecoinsPopupStepTwoComponent,
    FreecoinsPopupStepThreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
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
  ],
})
export class FreecoinsModule { }
