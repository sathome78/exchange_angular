import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng5SliderModule} from 'ng5-slider';
import {SettingsService} from '../settings/settings.service';
import {OrdersRoutingModule} from './orders-routing.module';
import {OpenOrdersComponent} from './open-orders/open-orders.component';
import {OrdersHistoryComponent} from './orders-history/orders-history.component';
import {EmbeddedOrdersService} from '../dashboard/components/embedded-orders/embedded-orders.service';
import {NgxPaginationModule} from 'ngx-pagination';
import {MyDatePickerModule} from 'mydatepicker';
import {OrdersService} from './orders.service';
import {AuthInterceptor} from 'app/core/interceptors/auth.interceptor';
import {JwtInterceptor} from 'app/core/interceptors/jwt.interceptor';
import {EffectsModule} from '@ngrx/effects';
import {OrdersEffects} from './store/effects/orders.effects';
import {reducer} from './store/reducers/orders.reducer';
import {SplitCurrencyPipe} from 'app/shared/pipes/split-currency.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {OrdersComponent} from './orders.component';
import {SharedModule} from 'app/shared/shared.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng5SliderModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MyDatePickerModule,
    EffectsModule.forRoot([OrdersEffects]),
    StoreModule.forFeature('orders', reducer),
    NgSelectModule,
    OrdersRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
  ],
  declarations: [
    OpenOrdersComponent,
    OrdersHistoryComponent,
    OrdersComponent,
  ],
  providers: [
    EmbeddedOrdersService,
    OrdersService,

    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ]
})
export class OrdersModule {

}
