import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SimpleChat } from '../simple-chat.model';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as fromCore from '../../../../core/reducers';

@Component({
  selector: 'app-chat-message',
  templateUrl: 'chat-message.component.html',
  styleUrls: ['chat-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessageComponent implements OnInit {
  @Input() message: SimpleChat;
  public userInfo: ParsedToken;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<fromCore.State>) {
    this.store
      .pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  ngOnInit() {}

  isMine(): boolean {
    return this.message.email === (this.userInfo && this.userInfo.username);
  }

  getDate(value: string): Date {
    // console.log('date: ' + value);
    if (value) {
      return new Date(value);
    }
    return new Date();
  }
}
