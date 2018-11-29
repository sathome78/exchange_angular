import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng5SliderModule} from 'ng5-slider';
import {SettingsService} from '../settings/settings.service';
import {OrdersRoutingModule} from './orders-routing.module';
import {OpenOrdersComponent} from './open-orders/open-orders.component';
import {OrdersHistoryComponent} from './orders-history/orders-history.component';
import {EmbeddedOrdersService} from '../dashboard/components/embedded-orders/embedded-orders.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng5SliderModule,
    ReactiveFormsModule,
    OrdersRoutingModule
  ],
  declarations: [
    OpenOrdersComponent,
    OrdersHistoryComponent
  ],
  providers: [
    EmbeddedOrdersService
  ]
})
export class OrdersModule {

}
