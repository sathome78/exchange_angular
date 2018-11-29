import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {OrdersComponent} from './orders.component';
import {OpenOrdersComponent} from './open-orders/open-orders.component';
import {OrdersHistoryComponent} from './orders-history/orders-history.component';

const ordersRoutes: Routes = [
  { path: 'orders',
    component: OrdersComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'open'},
      { path: 'open', component: OpenOrdersComponent },
      { path: 'closed', component: OrdersHistoryComponent },
      { path: '**', redirectTo: 'open'}
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(ordersRoutes) ],
  exports: [ RouterModule ]
})
export class OrdersRoutingModule {
}
