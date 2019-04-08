import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IEOComponent} from './ieo.component';
import {IEOInfoComponent} from './components/ieo-info/ieo-info.component';
import {SharedModule} from 'app/shared/shared.module';
import {IEORoutingModule} from './ieo.routing';
import {IEOCommunityComponent} from './components/ieo-community/ieo-community.component';
import {IEORequirementsComponent} from './components/ieo-requirements/ieo-requirements.component';
import {IEOHowItWorksComponent} from './components/ieo-how-it-works/ieo-how-it-works.component';
import {IEODescriptionsComponent} from './components/ieo-descriptions/ieo-descriptions.component';
import {PopupBuyComponent} from './components/popup-buy/popup-buy.component';
import {PopupNotificationComponent} from './components/popup-notification/popup-notification.component';
import {IeoHeaderComponent} from './components/ieo-header/ieo-header.component';
import {IEOServiceService} from '../shared/services/ieoservice.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from 'app/core/interceptors/auth.interceptor';
import {JwtInterceptor} from 'app/core/interceptors/jwt.interceptor';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {PopupPolicyComponent} from './components/popup-policy/popup-policy.component';
import {PopupSuccessComponent} from './components/popup-success/popup-success.component';

@NgModule({
  declarations: [
    IEOComponent,
    IEOInfoComponent,
    IEOCommunityComponent,
    IEORequirementsComponent,
    IEOHowItWorksComponent,
    IEODescriptionsComponent,
    PopupBuyComponent,
    PopupNotificationComponent,
    IeoHeaderComponent,
    PopupPolicyComponent,
    PopupSuccessComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IEORoutingModule,
  ],
  providers: [
    IEOServiceService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ]
})
export class IEOModule { }