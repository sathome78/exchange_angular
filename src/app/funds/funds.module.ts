import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng5SliderModule} from 'ng5-slider';
// import {SettingsService} from '../settings/settings.service';
// import {OpenOrdersComponent} from './open-orders/open-orders.component';
// import {OrdersHistoryComponent} from './orders-history/orders-history.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {MyDatePickerModule} from 'mydatepicker';
import {AuthInterceptor} from 'app/core/interceptors/auth.interceptor';
import {JwtInterceptor} from 'app/core/interceptors/jwt.interceptor';
// import {EffectsModule} from '@ngrx/effects';
// import {OrdersEffects} from './store/effects/orders.effects';
// import {reducer} from './store/reducers/orders.reducer';
import {SplitCurrencyPipe} from 'app/shared/pipes/split-currency.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {FundsComponent} from './funds.component';
import {FundsRoutingModule} from './funds.routing';
import {BalanceComponent} from './balance/balance.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng5SliderModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MyDatePickerModule,
    // EffectsModule.forRoot([FundsEffects]),
    // StoreModule.forFeature('orders', reducer),
    NgSelectModule,
    FundsRoutingModule,
  ],
  declarations: [
    FundsComponent,
    BalanceComponent,
  ],
  providers: [
    // OrdersService,

    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ]
})
export class FundsModule {

}
