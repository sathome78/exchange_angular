import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ReferralStructureComponent } from './referral/referral-structure/referral-structure.component';
import { ReferralChargesComponent } from './referral/referral-charges/referral-charges.component';
import { FinalRegistrationComponent } from './auth/final-registration/final-registration.component';
import { FinalStepRecoveryPasswordComponent } from './auth/final-step-recovery-password/final-step-recovery-password.component';
import { RegistrationGuard } from './shared/guards/registaration.guard';
import { RestorePasswordGuard } from './shared/guards/restore-password.guard';

const routes: Routes = [
  // permit all
  { path: 'registration', component: DashboardComponent },
  { path: 'login', component: DashboardComponent },
  { path: 'markets/:currency-pair', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'final-registration/token', component: FinalRegistrationComponent, canActivate: [RegistrationGuard] },
  { path: 'referral-structure', component: ReferralStructureComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'referral-charges', component: ReferralChargesComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'recovery-password', component: FinalStepRecoveryPasswordComponent, canActivate: [RestorePasswordGuard] },
  { path: 'funds', loadChildren: 'app/funds/funds.module#FundsModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'orders', loadChildren: 'app/orders/orders.module#OrdersModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'static', loadChildren: './static-pages/static-pages.module#StaticPagesModule' },

  // { path: 'dashboard',      component: DashboardComponent },
  // { path: 'balance',      component: BalanceComponent },
  // { path: 'refill-money',      component: RefillMoneyComponent },
  // { path: 'open-orders', component: OpenOrdersComponent },
  // { path: 'orders-history', component: OrdersHistoryComponent },
  // { path: 'referral-structure', component: ReferralStructureComponent },
  // { path: 'referral-charges', component: ReferralChargesComponent },
  // { path: 'funds',      component: DashboardComponent, },ç
  // { path: 'orders',      component: DashboardComponent, },
  // { path: 'tfa-popup', component: TwoFactorPopupComponent },
  // { path: 'settings',  component: SettingsComponent,    loadChildren: 'app/settings/settings.module#SettingsModule' },


  // { path: 'login',          loadChildren: 'app/user/login/login.module#LoginModule' },
  //
  // // secure
  // { path: 'settings',  loadChildren: () => SettingsModule },
  // { path: 'balance/',       loadChildren: 'app/balance/balance.module#BalanceModule',         },
  // { path: 'referral/',      loadChildren: 'app/referral/referral.module#ReferralModule'},
  // { path: 'orders/',         loadChildren: 'app/orders/orders.module#OrdersModule'},
  // // { path: 'referral',       component: ReferralComponent },
  // // {path: 'test', component: TestComponent },

  {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
