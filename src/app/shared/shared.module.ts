import { NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/notifications.service';

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [

  ],
  exports: [
    NotificationComponent
  ],
  providers: [
    NotificationsService
  ]
})
export class SharedModule { }
