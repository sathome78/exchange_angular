import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { State } from 'app/core/reducers';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../../core/reducers'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Notification } from 'app/model/notification.model';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    private userService: UserService,
    private store: Store<State>,
  ) {
    this.store.pipe(select(fromCore.getIsAuthenticated))
      .subscribe((isAuth: boolean) => {
        const sub = this.userService.getNotifications()
        if(isAuth) {
          sub.pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((res) => {
              if(res.typeEnum) {
                return
              }
              const n = new Notification(res);
              this.list = [...this.list, n];
              this.showList = this.list.filter((i) => !i.viewed)
            });
        }
      });
  }

  public list: Notification[] = [];
  public showList: Notification[] = [];

  ngOnInit() {
  }

  public closeNotification(itemId) {
    const index = this.list.findIndex((i) => i.id === itemId.id);
    if(index >=0) {
      this.list[index].viewed = true;
      this.list = [...this.list];
    }
  }

}
