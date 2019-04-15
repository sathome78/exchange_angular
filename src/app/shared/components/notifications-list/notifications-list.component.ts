import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { State } from 'app/core/reducers';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../../core/reducers'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Notification } from 'app/model/notification.model';
import { ToastrService, IndividualConfig, GlobalConfig } from 'ngx-toastr';
import { TopNotificationComponent } from '../top-notification/top-notification.component';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  private toastOption: any
  constructor(
    private userService: UserService,
    private store: Store<State>,
    private toastr: ToastrService,
  ) {
    this.toastOption = this.toastr.toastrConfig;
    this.store.pipe(select(fromCore.getIsAuthenticated))
      .subscribe((isAuth: boolean) => {
        if(isAuth) {
          this.userService.getNotifications()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((res) => {
              if(res.typeEnum) {
                return
              }
              const n = new Notification(res);
              this.showNotification(n);
            });
        }
      });
  }

  public list: Notification[] = [
    new Notification({text: 'success notification', notificationType: 'ERROR'}),
    new Notification({text: 'success notification sadfasdf', notificationType: 'SUCCESS'}),
    new Notification({text: 'success notification asdfasdf', notificationType: 'ERROR'}),
    new Notification({text: 'success notification   asdfasdf', notificationType: 'SUCCESS'}),

  ];

  ngOnInit() {
    setTimeout(() => {
      this.showNotification(this.list[0]);
      this.showNotification(this.list[1]);
      this.showNotification(this.list[2]);
      this.showNotification(this.list[3]);
    }, 1000)
  }

  showNotification(notification: Notification): void {
    this.toastOption.toastComponent = TopNotificationComponent;
    this.toastOption.disableTimeOut = true
    this.toastr.show(notification.message, notification.title, this.toastOption);
  }

}
