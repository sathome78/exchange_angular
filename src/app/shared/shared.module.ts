import { NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/notifications.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SortPipe} from './pipes/sort.pipe';
import {GroupCoinPipe} from './pipes/group-coin.pipe';


@NgModule({
  declarations: [
    NotificationComponent,
    SortPipe,
    GroupCoinPipe,
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    NotificationComponent,
    SortPipe,
    GroupCoinPipe,
  ],
  providers: [
    NotificationsService
  ]
})
export class SharedModule { }
