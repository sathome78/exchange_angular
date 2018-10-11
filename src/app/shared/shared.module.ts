import { NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/notifications.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    NotificationComponent,
  ],
  providers: [
    NotificationsService
  ]
})
export class SharedModule { }
