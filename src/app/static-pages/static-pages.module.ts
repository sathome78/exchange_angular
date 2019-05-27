import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticPagesComponent } from './static-pages.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { StaticPagesRoutingModule } from './static-pages.routing';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {translateInfo} from '../shared/configs/translate-options';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContactsService} from './services/contacts.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, translateInfo.path.staticPages, translateInfo.suffix);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StaticPagesRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    StaticPagesComponent,
    AboutUsComponent,
    ContactsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent
  ],
  providers: [
    ContactsService
  ]
})
export class StaticPagesModule {
}
