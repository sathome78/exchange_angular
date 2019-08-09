import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { State } from 'app/core/reducers';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Notification } from 'app/model/notification.model';
import { ToastrService } from 'ngx-toastr';
import { TopNotificationComponent } from './top-notification/top-notification.component';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
})
export class NotificationsListComponent implements OnInit {
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  private toastOption: any;
  constructor(private userService: UserService, private store: Store<State>, private toastr: ToastrService) {
    this.toastOption = this.toastr.toastrConfig;
  }

  public list: Notification[] = [
    new Notification({
      text: 'success notification',
      notificationType: 'ERROR',
    }),
  ];

  ngOnInit() {
    let sub;
    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(withLatestFrom(this.store.pipe(select(fromCore.getUserInfo))))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([isAuth, userInfo]: [boolean, ParsedToken]) => {
        if (isAuth && userInfo) {
          sub = this.userService
            .getNotifications(userInfo.publicId)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(res => {
              if (res.typeEnum) {
                return;
              }
              const n = new Notification(res);
              this.showNotification(n);
            });
        } else {
          if (!sub) {
            return;
          }
          sub.unsubscribe();
        }
      });
  }

  showNotification(notification: Notification): void {
    this.toastOption.toastComponent = TopNotificationComponent;
    this.toastOption.disableTimeOut = true;
    if (notification.title === 'SUCCESS') {
      this.toastOption.disableTimeOut = false;
      this.toastOption.timeOut = 3000;
      this.toastOption.extendedTimeOut = 3000;
    }
    this.toastr.show(notification.message, notification.title, this.toastOption);
  }
}
