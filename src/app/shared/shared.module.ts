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
import {UtilsService} from './services/utils.service';
import {RegistrationGuard} from './guards/registaration.guard';
import {LoaderComponent} from './components/loader/loader.component';
import {GetIconUrl} from './pipes/get-icon-url';
import {ExcludeByFieldPipe} from './pipes/exclude-by-field.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {DynamicInputComponent} from './components/dynamic-input/dynamic-input.component';
import {CustomSearchInputComponent} from './components/custom-search-input/custom-search-input.component';
import {DynamicInputDashboardComponent} from './components/dynamic-input-dashboard/dynamic-input-dashboard.component';
import {DynamicInputDataPipe} from './pipes/dynamic-input-data.pipe';
import {RestorePasswordGuard} from './guards/restore-password.guard';
import {GetObjectKeysPipe} from './pipes/getObjectKeys.pipe';
import {MomentModule} from 'angular2-moment';
import {ExponentToNumberPipe} from './pipes/exponent-to-number.pipe';
import {AddClassDirective} from './directives/add-class.directive';
import {ConstantsService} from './services/constants.service';
import {SafePipe} from './pipes/safe.pipe';
import { DateMaskInputComponent } from './components/date-mask-input/date-mask-input.component';
import {DateMaskDirective} from './directives/date-mask.directive';

@NgModule({
  declarations: [
    NotificationComponent,
    PriceInputComponent,
    SortPipe,
    GetIconUrl,
    ReplaceNumberPipe,
    ExcludeByFieldPipe,
    GroupCoinPipe,
    CurrencyPipe,
    DropdownDirective,
    DateMaskDirective,
    AddClassDirective,
    OnlyNumbersDirective,
    BuyTotalCalculatePipe,
    SellTotalCalculatePipe,
    RoundCurrencyPipe,
    ExponentToNumberPipe,
    GetObjectKeysPipe,
    SafePipe,
    FormatCurrencyPipe,
    SplitCurrencyPipe,
    PageItemsDropdownComponent,
    DateWrapper,
    LoaderComponent,
    DynamicInputComponent,
    CustomSearchInputComponent,
    DynamicInputDashboardComponent,
    DynamicInputDataPipe,
    DateMaskInputComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    QRCodeModule,
    InfiniteScrollModule,
    RecaptchaModule,
    MomentModule
  ],
  exports: [
    InfiniteScrollModule,
    PerfectScrollbarModule,
    CustomSearchInputComponent,
    QRCodeModule,
    RecaptchaModule,
    SafePipe,
    GetObjectKeysPipe,
    InfiniteScrollModule,
    DateMaskDirective,
    NotificationComponent,
    PriceInputComponent,
    SortPipe,
    ReplaceNumberPipe,
    DateMaskInputComponent,
    GroupCoinPipe,
    CurrencyPipe,
    FormatCurrencyPipe,
    DropdownDirective,
    OnlyNumbersDirective,
    BuyTotalCalculatePipe,
    SellTotalCalculatePipe,
    ExponentToNumberPipe,
    ExcludeByFieldPipe,
    RoundCurrencyPipe,
    FormatCurrencyPipe,
    PageItemsDropdownComponent,
    SplitCurrencyPipe,
    LoaderComponent,
    DateWrapper,
    GetIconUrl,
    DynamicInputComponent,
    DynamicInputDashboardComponent,
    DynamicInputDataPipe,
    AddClassDirective
  ],
  providers: [
    NotificationsService,
    UtilsService,
    BalanceMobileRoutesGuard,
    RegistrationGuard,
    RestorePasswordGuard,
    ConstantsService,
  ]
})
export class SharedModule { }
