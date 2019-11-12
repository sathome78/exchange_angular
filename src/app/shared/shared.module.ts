import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/notifications.service';
import { SortPipe } from './pipes/sort.pipe';
import { GroupCoinPipe } from './pipes/group-coin.pipe';
import { ReplaceNumberPipe } from './pipes/number-replace.pipe';
import { CurrencyPipe } from './pipes/currency.pipe';
import { DropdownDirective } from './directives/dropdown.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { PriceInputComponent } from './components/price-input/price-input.component';
import { BuyTotalCalculatePipe } from './pipes/buy-total-calculate.pipe';
import { SellTotalCalculatePipe } from './pipes/sell-total-calculate.pipe';
import { PageItemsDropdownComponent } from './components/page-items-dropdown/page-items-dropdown.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QRCodeModule } from 'angular2-qrcode';
import { RecaptchaModule } from 'ng-recaptcha';
import { DateWrapper } from './pipes/dateWrapper.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BalanceMobileRoutesGuard } from './guards/balance-mobile-routes.guard';
import { RoundCurrencyPipe } from './pipes/round-currency.pipe';
import { FormatCurrencyPipe } from './pipes/format-currency.pipe';
import { SplitCurrencyPipe } from './pipes/split-currency.pipe';
import { UtilsService } from './services/utils.service';
import { RegistrationGuard } from './guards/registaration.guard';
import { LoaderComponent } from './components/loader/loader.component';
import { GetIconUrl } from './pipes/get-icon-url';
import { ExcludeByFieldPipe } from './pipes/exclude-by-field.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { CustomSearchInputComponent } from './components/custom-search-input/custom-search-input.component';
import { DynamicInputDashboardComponent } from './components/dynamic-input-dashboard/dynamic-input-dashboard.component';
import { DynamicInputDataPipe } from './pipes/dynamic-input-data.pipe';
import { RestorePasswordGuard } from './guards/restore-password.guard';
import { GetObjectKeysPipe } from './pipes/getObjectKeys.pipe';
import { MomentModule } from 'ngx-moment';
import { AddClassDirective } from './directives/add-class.directive';
import { ConstantsService } from './services/constants.service';
import { SafePipe } from './pipes/safe.pipe';
import { DateMaskInputComponent } from './components/date-mask-input/date-mask-input.component';
import { DateMaskDirective } from './directives/date-mask.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ExcludeSpacesDirective } from './directives/exclude-spaces.directive';
import { ShowOrderStatusPipe } from './pipes/showOrderStatus.pipe';
import { MerchantImageFilterPipe } from './pipes/merchant-image-filter.pipe';
import { ReplaceCharPipe } from './pipes/replaceChar.pipe';
import { ShowStageStatusPipe } from './pipes/stage-status.pipe';
import { PopupBuyComponent } from './components/popup-buy-ieo/popup-buy.component';
import { PopupSuccessComponent } from './components/popup-success-ieo/popup-success.component';
import { OrderBookCutBigNumPipe } from './pipes/order-book-cut-big-num.pipe';
import { TooltipDirective } from './directives/tooltip.directive';
import { GetCountConfirmationsPipe } from './pipes/get-count-confirmations.pipe';
import { ShowPageGuard } from './guards/showPage.guard';
import { GetDateStringPipe } from './pipes/parse-date-utc.pipe';
import { DateFromISO8601Pipe } from './pipes/dateFromISO8601.pipe';
import { RefactUrlByNewsPipe } from './pipes/refact-url-by-news.pipe';
import { CutAddEllipsisPipe } from './pipes/cut-add-ellipsis.pipe';
import { CurrencyFormatPipe } from './pipes/currencyFormat.pipe';
import { PopupWaitIEOComponent } from './components/popup-wait-ieo/popup-wait-ieo.component';
import { PopupSorryIEOComponent } from './components/popup-sorry-ieo/popup-sorry-ieo.component';
import { BirthdayMaskInputComponent } from './components/birthday-mask-input/birthday-mask-input.component';
import { CheatingInputComponent } from './components/cheating-input/cheating-input.component';
import { APIErrorsService } from './services/apiErrors.service';
import { CurrencySelectFiatComponent } from './components/currency-select-fiat/currency-select-fiat.component';
import { CurrencySelectCryptoComponent } from './components/currency-select-crypto/currency-select-crypto.component';
import { TimeLeftFreeCoinsPipe } from './pipes/time-left.pipe';
import { DisableGetFreeCoinsPipe } from './pipes/disable-get-coins.pipe';
import { UnsubscribeGuard } from './guards/unsubscribe.guard';
import { NgxMaskModule } from 'ngx-mask';
import { NewPriceInputComponent } from './components/new-price-input/new-price-input.component';

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
    RefactUrlByNewsPipe,
    ExcludeSpacesDirective,
    RoundCurrencyPipe,
    ShowOrderStatusPipe,
    GetCountConfirmationsPipe,
    GetObjectKeysPipe,
    SafePipe,
    FormatCurrencyPipe,
    GetDateStringPipe,
    CutAddEllipsisPipe,
    SplitCurrencyPipe,
    ReplaceCharPipe,
    PageItemsDropdownComponent,
    DateWrapper,
    DateFromISO8601Pipe,
    LoaderComponent,
    DynamicInputComponent,
    CustomSearchInputComponent,
    TooltipDirective,
    DynamicInputDashboardComponent,
    DynamicInputDataPipe,
    DateMaskInputComponent,
    OrderBookCutBigNumPipe,
    ShowStageStatusPipe,
    PopupBuyComponent,
    PopupSuccessComponent,
    CurrencyFormatPipe,
    PopupWaitIEOComponent,
    PopupSorryIEOComponent,
    BirthdayMaskInputComponent,
    CheatingInputComponent,
    CurrencySelectFiatComponent,
    CurrencySelectCryptoComponent,
    TimeLeftFreeCoinsPipe,
    DisableGetFreeCoinsPipe,
    NewPriceInputComponent,
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
    NgxMaskModule.forChild({}),
  ],
  exports: [
    InfiniteScrollModule,
    PerfectScrollbarModule,
    CustomSearchInputComponent,
    QRCodeModule,
    RecaptchaModule,
    SafePipe,
    ExcludeSpacesDirective,
    TooltipDirective,
    GetObjectKeysPipe,
    InfiniteScrollModule,
    DateMaskDirective,
    NotificationComponent,
    PriceInputComponent,
    SortPipe,
    ReplaceNumberPipe,
    DateMaskInputComponent,
    BirthdayMaskInputComponent,
    GetDateStringPipe,
    DateFromISO8601Pipe,
    MerchantImageFilterPipe,
    CutAddEllipsisPipe,
    GetCountConfirmationsPipe,
    RefactUrlByNewsPipe,
    ShowOrderStatusPipe,
    OrderBookCutBigNumPipe,
    GroupCoinPipe,
    CurrencyPipe,
    FormatCurrencyPipe,
    DropdownDirective,
    OnlyNumbersDirective,
    BuyTotalCalculatePipe,
    SellTotalCalculatePipe,
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
    PopupBuyComponent,
    PopupSuccessComponent,
    AddClassDirective,
    CurrencyFormatPipe,
    PopupWaitIEOComponent,
    PopupSorryIEOComponent,
    CheatingInputComponent,
    CurrencySelectFiatComponent,
    CurrencySelectCryptoComponent,
    TimeLeftFreeCoinsPipe,
    DisableGetFreeCoinsPipe,
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
    UnsubscribeGuard,
    ShowPageGuard,
    APIErrorsService,
  ],
})
export class SharedModule {}
