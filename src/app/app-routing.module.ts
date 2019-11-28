import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RegistrationGuard } from './shared/guards/registaration.guard';
import { RestorePasswordGuard } from './shared/guards/restore-password.guard';
import { FinalRegistrationComponent } from './popups/final-registration/final-registration.component';
import { FinalStepRecoveryPasswordComponent } from './popups/final-step-recovery-password/final-step-recovery-password.component';
import { ShowPageGuard } from './shared/guards/showPage.guard';
import { NewsComponent } from './news/news.component';
import { FiatComponent } from './fiat/fiat.component';
import { AdvisorComponent } from './advisor/advisor.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { UnsubscribeGuard } from './shared/guards/unsubscribe.guard';
import { MainPageComponent } from './main-page/main-page.component';
import { ReferalComponent } from './referal/referal.component';

const routes: Routes = [
  // permit all
  { path: 'registration', component: DashboardComponent },
  { path: 'login', component: DashboardComponent },
  { path: 'advisor', component: AdvisorComponent },
  { path: 'markets/:currency-pair', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'news', component: NewsComponent },
  { path: 'fiat', component: FiatComponent },
  { path: 'unsubscribe', component: UnsubscribeComponent, canActivate: [UnsubscribeGuard] },
  { path: 'free-coins', loadChildren: './freecoins/freecoins.module#FreecoinsModule' },
  { path: 'referral', component: ReferalComponent },
  {
    path: 'final-registration/token',
    component: FinalRegistrationComponent,
    canActivate: [RegistrationGuard],
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'recovery-password',
    component: FinalStepRecoveryPasswordComponent,
    canActivate: [RestorePasswordGuard],
  },
  {
    path: 'funds',
    loadChildren: 'app/funds/funds.module#FundsModule',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'orders',
    loadChildren: 'app/orders/orders.module#OrdersModule',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'static',
    loadChildren: './static-pages/static-pages.module#StaticPagesModule',
  },
  { path: 'ieo', loadChildren: 'app/ieo/ieo.module#IEOModule' },

  { path: '', pathMatch: 'full', component: MainPageComponent },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
