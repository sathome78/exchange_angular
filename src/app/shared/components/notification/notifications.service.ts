import { EventEmitter, Injectable, Output } from '@angular/core';
import { NotificationMessage } from '../../models/notification-message-model';

/**
 * Notification service which is used by components to show message
 */
@Injectable()
export class NotificationsService {
  /** notification message to show */
  @Output() message = new EventEmitter<NotificationMessage>(true);
  /** emit event on notification close */
  @Output() close = new EventEmitter();
}
