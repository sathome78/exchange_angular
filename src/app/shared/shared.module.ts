import { NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/notifications.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SortPipe} from './pipes/sort.pipe';
import {GroupCoinPipe} from './pipes/group-coin.pipe';
import {ReplaceNumberPipe} from './pipes/number-replace.pipe';
import {CurrencyPipe} from './pipes/currency.pipe';
import {OnlyNumbersDirective} from './derectives/only-numbers.directive';
import {PriceInputComponent} from './components/price-input/price-input.component';


@NgModule({
  declarations: [
    NotificationComponent,
    PriceInputComponent,
    SortPipe,
    ReplaceNumberPipe,
    GroupCoinPipe,
    CurrencyPipe,
    OnlyNumbersDirective,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    NotificationComponent,
    PriceInputComponent,
    OnlyNumbersDirective,
    SortPipe,
    ReplaceNumberPipe,
    GroupCoinPipe,
    CurrencyPipe,
  ],
  providers: [
    NotificationsService
  ]
})
export class SharedModule { }
