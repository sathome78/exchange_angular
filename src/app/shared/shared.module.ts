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
import {MomentModule} from 'ngx-moment';
import {ExponentToNumberPipe} from './pipes/exponent-to-number.pipe';
import {AddClassDirective} from './directives/add-class.directive';
import {ConstantsService} from './services/constants.service';
import {SafePipe} from './pipes/safe.pipe';
import {DateMaskInputComponent} from './components/date-mask-input/date-mask-input.component';
import {DateMaskDirective} from './directives/date-mask.directive';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ExcludeSpacesDirective} from './directives/exclude-spaces.directive';
import {ShowOrderStatusPipe} from './pipes/showOrderStatus.pipe';
import {MerchantImageFilterPipe} from './pipes/merchant-image-filter.pipe';
import {ReplaceCharPipe} from './pipes/replaceChar.pipe';
import {ShowStageStatusPipe} from './pipes/stage-status.pipe';
import {TopNotificationComponent} from './components/top-notification/top-notification.component';
import {NotificationsListComponent} from './components/notifications-list/notifications-list.component';
import {PopupBuyComponent} from './components/popup-buy-ieo/popup-buy.component';
import { PopupSuccessComponent } from './components/popup-success-ieo/popup-success.component';

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
    MerchantImageFilterPipe,
    ExcludeSpacesDirective,
    RoundCurrencyPipe,
    ExponentToNumberPipe,
    ShowOrderStatusPipe,
    GetObjectKeysPipe,
    SafePipe,
    FormatCurrencyPipe,
    SplitCurrencyPipe,
    ReplaceCharPipe,
    PageItemsDropdownComponent,
    DateWrapper,
    LoaderComponent,
    DynamicInputComponent,
    CustomSearchInputComponent,
    DynamicInputDashboardComponent,
    DynamicInputDataPipe,
    DateMaskInputComponent,
    TopNotificationComponent,
    ShowStageStatusPipe,
    NotificationsListComponent,
    PopupBuyComponent,
    PopupSuccessComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    QRCodeModule,
    InfiniteScrollModule,
    RecaptchaModule,
    ScrollingModule,
    MomentModule,
  ],
  exports: [
    InfiniteScrollModule,
    PerfectScrollbarModule,
    CustomSearchInputComponent,
    QRCodeModule,
    RecaptchaModule,
    SafePipe,
    ExcludeSpacesDirective,
    GetObjectKeysPipe,
    InfiniteScrollModule,
    DateMaskDirective,
    NotificationComponent,
    PriceInputComponent,
    SortPipe,
    ReplaceNumberPipe,
    DateMaskInputComponent,
    MerchantImageFilterPipe,
    ShowOrderStatusPipe,
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
    ReplaceCharPipe,
    DynamicInputComponent,
    DynamicInputDashboardComponent,
    DynamicInputDataPipe,
    ShowStageStatusPipe,
    TopNotificationComponent,
    NotificationsListComponent,
    PopupBuyComponent,
    PopupSuccessComponent,
    AddClassDirective,
  ],
  providers: [
    NotificationsService,
    UtilsService,
    BalanceMobileRoutesGuard,
    RegistrationGuard,
    RestorePasswordGuard,
    ConstantsService,
    RoundCurrencyPipe,
    FormatCurrencyPipe,
  ],
  entryComponents: [
    TopNotificationComponent,
  ]
})
export class SharedModule { }
