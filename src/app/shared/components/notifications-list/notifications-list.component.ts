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

  }

  public list: Notification[] = [
    new Notification({text: 'success notification', notificationType: 'ERROR'}),
  ];

  ngOnInit() {
    let sub
    this.store.pipe(select(fromCore.getIsAuthenticated))
      .subscribe((isAuth: boolean) => {
        if(isAuth) {
          sub = this.userService.getNotifications()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((res) => {
              if(res.typeEnum) {
                return;
              }
              const n = new Notification(res);
              this.showNotification(n);
            });
        } else {
          if(!sub) return;
          sub.unsubscribe();
        }
      });
  }

  showNotification(notification: Notification): void {
    this.toastOption.toastComponent = TopNotificationComponent;
    this.toastOption.disableTimeOut = true
    this.toastr.show(notification.message, notification.title, this.toastOption);
  }

}
