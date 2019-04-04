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
  ],
  imports: [
    CommonModule,
    SharedModule,
    IEORoutingModule,
  ],
  providers: []
})
export class IEOModule { }
