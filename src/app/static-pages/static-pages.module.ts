import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StaticPagesComponent } from "./static-pages/static-pages.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { StaticPagesRoutingModule } from "./static-pages.routing";

@NgModule({
  imports: [
    CommonModule,
    StaticPagesRoutingModule,
  ],
  declarations: [
    StaticPagesComponent,
    AboutUsComponent,
    ContactsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent
  ]
})
export class StaticPagesModule { }
