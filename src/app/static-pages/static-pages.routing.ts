import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';

const routes: Routes = [
  {
    path: '',
    component: StaticPagesComponent,
    children: [
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: '', pathMatch: 'full', redirectTo: '/static/contacts' },
      { path: '**', redirectTo: 'contacts' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPagesRoutingModule {
}
