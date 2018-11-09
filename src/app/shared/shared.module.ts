import { NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/notifications.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SortPipe} from './pipes/sort.pipe';
import {GroupCoinPipe} from './pipes/group-coin.pipe';
import {ReplaceNumberPipe} from './pipes/number-replace.pipe';


@NgModule({
  declarations: [
    NotificationComponent,
    SortPipe,
    ReplaceNumberPipe,
    GroupCoinPipe,
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    NotificationComponent,
    SortPipe,
    ReplaceNumberPipe,
    GroupCoinPipe,
  ],
  providers: [
    NotificationsService
  ]
})
export class SharedModule { }
