import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {MyDatePickerModule} from 'mydatepicker';
import {EffectsModule} from '@ngrx/effects';
import {NgSelectModule} from '@ng-select/ng-select';
import {AuthInterceptor} from '../core/interceptors/auth.interceptor';
import {JwtInterceptor} from '../core/interceptors/jwt.interceptor';
import {FundsEffects} from './store/effects/funds.effects';
import {reducer} from './store/reducers/funds.reducer';
import {FundsComponent} from './funds.component';
import {FundsRoutingModule} from './funds.routing';
import {BalanceComponent} from './balance/balance.component';
import {CryptoBalanceTableComponent} from './crypto-balance-table/crypto-balance-table.component';
import {FiatBalanceTableComponent} from './fiat-balance-table/fiat-balance-table.component';
import {PendingRequestTableComponent} from './pending-request-table/pending-request-table.component';
import {SharedModule} from '../shared/shared.module';
import {FundsService} from './funds.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MyDatePickerModule,
    SharedModule,
    EffectsModule.forRoot([FundsEffects]),
    StoreModule.forFeature('funds', reducer),
    NgSelectModule,
    FundsRoutingModule,
  ],
  declarations: [
    FundsComponent,
    BalanceComponent,
    CryptoBalanceTableComponent,
    FiatBalanceTableComponent,
    PendingRequestTableComponent,
  ],
  providers: [
    FundsService,

    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ]
})
export class FundsModule {

}
