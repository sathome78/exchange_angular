import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {NotificationComponent} from './components/notification/notification.component';
import {NotificationsService} from './components/notification/notifications.service';
import {SortPipe} from './pipes/sort.pipe';
import {GroupCoinPipe} from './pipes/group-coin.pipe';
import {ReplaceNumberPipe} from './pipes/number-replace.pipe';
import {CurrencyPipe} from './pipes/currency.pipe';
import {DropdownDirective} from './directives/dropdown.directive';
import {OnlyNumbersDirective} from './directives/only-numbers.directive';
import {PriceInputComponent} from './components/price-input/price-input.component';
import {BuyTotalCalculatePipe} from './pipes/buy-total-calculate.pipe';
import {SellTotalCalculatePipe} from './pipes/sell-total-calculate.pipe';
import {PageItemsDropdownComponent} from './components/page-items-dropdown/page-items-dropdown.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {QRCodeModule} from 'angular2-qrcode';
import {RecaptchaModule} from 'ng-recaptcha';
import {DateWrapper} from './pipes/dateWrapper.pipe';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {BalanceMobileRoutesGuard} from './guards/balance-mobile-routes.guard';
import {RoundCurrencyPipe} from './pipes/round-currency.pipe';
import {FormatCurrencyPipe} from './pipes/format-currency.pipe';
import {SplitCurrencyPipe} from './pipes/split-currency.pipe';
import { UtilsService } from './services/utils.service';

@NgModule({
  declarations: [
    NotificationComponent,
    PriceInputComponent,
    SortPipe,
    ReplaceNumberPipe,
    GroupCoinPipe,
    CurrencyPipe,
    DropdownDirective,
    OnlyNumbersDirective,
    BuyTotalCalculatePipe,
    SellTotalCalculatePipe,
    RoundCurrencyPipe,
    FormatCurrencyPipe,
    SplitCurrencyPipe,
    PageItemsDropdownComponent,
    DateWrapper,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    QRCodeModule,
    InfiniteScrollModule,
    RecaptchaModule
  ],
  exports: [
    InfiniteScrollModule,
    PerfectScrollbarModule,
    QRCodeModule,
    RecaptchaModule,
    InfiniteScrollModule,
    NotificationComponent,
    PriceInputComponent,
    SortPipe,
    ReplaceNumberPipe,
    GroupCoinPipe,
    CurrencyPipe,
    DropdownDirective,
    OnlyNumbersDirective,
    BuyTotalCalculatePipe,
    SellTotalCalculatePipe,
    RoundCurrencyPipe,
    FormatCurrencyPipe,
    PageItemsDropdownComponent,
    SplitCurrencyPipe,
    DateWrapper,
  ],
  providers: [
    NotificationsService,
    UtilsService,
    BalanceMobileRoutesGuard,
  ]
})
export class SharedModule { }
