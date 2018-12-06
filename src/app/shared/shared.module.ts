import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/notifications.service';
import {SortPipe} from './pipes/sort.pipe';
import {GroupCoinPipe} from './pipes/group-coin.pipe';
import {ReplaceNumberPipe} from './pipes/number-replace.pipe';
import {CurrencyPipe} from './pipes/currency.pipe';
import {DropdownDirective} from './directives/dropdown.directive';
import {OnlyNumbersDirective} from './directives/only-numbers.directive';
import {PriceInputComponent} from './components/price-input/price-input.component';
import {BuyTotalCalculatePipe} from './pipes/buy-total-calculate.pipe';
import {SellTotalCalculatePipe} from './pipes/sell-total-calculate.pipe';
import { PageItemDropdownComponent } from './components/page-item-dropdown/page-item-dropdown.component';


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
    PageItemDropdownComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
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
    PageItemDropdownComponent,
  ],
  providers: [
    NotificationsService
  ]
})
export class SharedModule { }
