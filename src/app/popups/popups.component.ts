import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PopupService} from '../shared/services/popup.service';
import {NotificationMessage} from '../shared/models/notification-message-model';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NotificationsService} from '../shared/components/notification/notifications.service';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.scss'],
})
export class PopupsComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  /** notification messages array */
  notificationMessages: NotificationMessage[];

  constructor(
    public popupService: PopupService,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit() {
    this.subscribeForNotifications();
  }

  /**
   * Subscription for app notifications
   */
  private subscribeForNotifications(): void {
    this.notificationService.message
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: NotificationMessage) => {
        this.notificationMessages.push(message);
      });
  }

  onNotificationMessageClose(index: number): void {
    this.notificationMessages.splice(index, 1);
  }

  trackByIndex(index, item) {
    return index;
  }

}
