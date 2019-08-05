import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NotificationMessage } from '../../models/notification-message-model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  /** message to show */
  @Input() notification: NotificationMessage;
  /** notification closed output event */
  @Output() notificationClosed = new EventEmitter();
  /** show notification message by default time */
  defaultTimeout = 5000;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.notificationClosed.emit();
    }, this.defaultTimeout);
  }

  /**
   * Notification closed
   */
  onNotificationClose(): void {
    this.notificationClosed.emit();
  }
}
