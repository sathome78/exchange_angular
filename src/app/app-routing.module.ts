import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './services/auth.guard';
import {BalanceComponent} from './balance/balance.component';
import {TransactionHistoryComponent} from './transaction-history/transaction-history.component';
import {OrdersHistoryComponent} from './orders/orders-history/orders-history.component';
import {OpenOrdersComponent} from './orders/open-orders/open-orders.component';
import {ReferralStructureComponent} from './referral/referral-structure/referral-structure.component';
import {ReferralChargesComponent} from './referral/referral-charges/referral-charges.component';
import {FinalRegistrationComponent} from './auth/final-registration/final-registration.component';
import {SettingsComponent} from './settings/settings.component';
import {FinalStepRecoveryPasswordComponent} from './auth/final-step-recovery-password/final-step-recovery-password.component';

const routes: Routes = [
  // permit all
  {path: 'dashboard/markets/:currency-pair', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  // {path: 'balance', component: BalanceComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  // {path: 'transaction-history', component: TransactionHistoryComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  // {path: 'open-orders', component: OpenOrdersComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  // {path: 'final-registration/token', component: FinalRegistrationComponent},
  // {path: 'orders-history', component: OrdersHistoryComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  // {path: 'referral-structure', component: ReferralStructureComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  // {path: 'referral-charges', component: ReferralChargesComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  // {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},

  {path: 'recovery-password', component: FinalStepRecoveryPasswordComponent},
  {path: 'balance', component: BalanceComponent },
  {path: 'transaction-history', component: TransactionHistoryComponent },
  {path: 'open-orders', component: OpenOrdersComponent },
  {path: 'final-registration/token', component: FinalRegistrationComponent},
  {path: 'orders-history', component: OrdersHistoryComponent },
  {path: 'referral-structure', component: ReferralStructureComponent },
  {path: 'referral-charges', component: ReferralChargesComponent },
  {path: 'settings', component: SettingsComponent},

  // { path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
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

  {path: '', pathMatch: 'full', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
