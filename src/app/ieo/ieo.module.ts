import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IEOComponent} from './ieo.component';
import {IEOInfoComponent} from './components/ieo-info/ieo-info.component';
import {SharedModule} from 'app/shared/shared.module';
import {IEORoutingModule} from './ieo.routing';
import {IEOCommunityComponent} from './components/ieo-community/ieo-community.component';
import {IEORequirementsComponent} from './components/ieo-requirements/ieo-requirements.component';
import {IEOHowItWorksComponent} from './components/ieo-how-it-works/ieo-how-it-works.component';
import {IEODescriptionComponent} from './components/ieo-description-wrapper/components/ieo-description/ieo-description.component';
import {IeoHeaderComponent} from './components/ieo-header/ieo-header.component';
import {IEOServiceService} from '../shared/services/ieoservice.service';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {AuthInterceptor} from 'app/core/interceptors/auth.interceptor';
import {JwtInterceptor} from 'app/core/interceptors/jwt.interceptor';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {PopupPolicyComponent} from './components/popup-policy/popup-policy.component';
import {PopupFailedComponent} from './components/popup-failed/popup-failed.component';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {translateInfo} from '../shared/configs/translate-options';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CommonIEOComponent} from './components/common-ieo/common-ieo.component';
import {MomentModule} from 'ngx-moment';
import {GetReadyBannerComponent} from './components/get-ready-banner/get-ready-banner.component';
import {IeoDescriptionWrapperComponent} from './components/ieo-description-wrapper/ieo-description-wrapper.component';
import {IeoDescription2Component} from './components/ieo-description-wrapper/components/ieo-description2/ieo-description2.component';
import {IeoDescription3Component} from './components/ieo-description-wrapper/components/ieo-description3/ieo-description3.component';
import {IeoDescription4Component} from './components/ieo-description-wrapper/components/ieo-description4/ieo-description4.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.funds, translateInfo.suffix);
}

@NgModule({
  declarations: [
    IEOComponent,
    IEOInfoComponent,
    IEOCommunityComponent,
    IEORequirementsComponent,
    IEOHowItWorksComponent,
    IEODescriptionComponent,
    PopupFailedComponent,
    IeoHeaderComponent,
    PopupPolicyComponent,
    CommonIEOComponent,
    GetReadyBannerComponent,
    IeoDescriptionWrapperComponent,
    IeoDescription2Component,
    IeoDescription3Component,
    IeoDescription4Component,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MomentModule,
    IEORoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
  ],
  providers: [
    IEOServiceService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ]
})
export class IEOModule { }
