import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {OrdersComponent} from './orders.component';
import {OpenOrdersComponent} from './open-orders/open-orders.component';
import {OrdersHistoryComponent} from './orders-history/orders-history.component';

const ordersRoutes: Routes = [
  { path: '',
    component: OrdersComponent,
    children: [
      { path: 'open', component: OpenOrdersComponent },
      { path: 'closed', component: OrdersHistoryComponent },
      { path: '', pathMatch: 'full', redirectTo: '/orders/open'},
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
