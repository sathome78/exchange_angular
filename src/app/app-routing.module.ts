import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingsModule} from './settings/settings.module';
import {SettingsComponent} from './settings/settings.component';


const routes: Routes = [
  // permit all
  { path: 'dashboard',      component: DashboardComponent },
  // { path: 'funds',      component: DashboardComponent, },ç
  // { path: 'orders',      component: DashboardComponent, },
  { path: 'settings',  component: SettingsComponent},
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

  {path: '', pathMatch: 'full', redirectTo: '/dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
