import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingsModule} from './settings/settings.module';
import {SettingsComponent} from './settings/settings.component';
import {TwoFactorPopupComponent} from './popups/two-factor-popup/two-factor-popup.component';
import {AuthGuard} from './services/auth.guard';
import {OrdersHistoryComponent} from './orders/orders-history/orders-history.component';
import {OpenOrdersComponent} from './orders/open-orders/open-orders.component';
import {ReferralStructureComponent } from './referral/referral-structure/referral-structure.component';
import {ReferralChargesComponent} from './referral/referral-charges/referral-charges.component'

const routes: Routes = [
  // permit all
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'open-orders', component: OpenOrdersComponent },
  { path: 'orders-history', component: OrdersHistoryComponent },
  { path: 'referral-structure', component: ReferralStructureComponent },
  { path: 'referral-charges', component: ReferralChargesComponent },
  // { path: 'funds',      component: DashboardComponent, },ç
  // { path: 'orders',      component: DashboardComponent, },
  // { path: 'settings',  component: SettingsComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
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

  // {path: '', pathMatch: 'full', redirectTo: '/settings'} // remove after demo
  {path: '', pathMatch: 'full', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
