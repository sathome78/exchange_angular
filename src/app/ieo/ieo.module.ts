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

@NgModule({
  declarations: [
    IEOComponent,
    IEOInfoComponent,
    IEOCommunityComponent,
    IEORequirementsComponent,
    IEOHowItWorksComponent,
    IEODescriptionsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    IEORoutingModule,

  ],
  providers: []
})
export class IEOModule { }
