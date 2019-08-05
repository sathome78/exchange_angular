import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AbstractDashboardItems } from '../../abstract-dashboard-items';
import { ChatService } from './chat.service';
import { DateChatItem } from './date-chat-item.model';
import { AuthService } from 'app/shared/services/auth.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../../core/reducers';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  // todo please implement sorting as backend returns sorted by date ascending with limit of 50 messages
  dateChatItems: DateChatItem[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  // retrive Element to handle scroll in chat
  @ViewChild('scrollWrapper') scrollWrapper: PerfectScrollbarComponent;
  public scrollStyles: any = null;
  public userInfo: ParsedToken;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef, private store: Store<fromCore.State>) {
    super();
    this.setScrollStylesForMobile();
    this.store
      .pipe(select(fromCore.getUserInfo))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userInfo: ParsedToken) => {
        this.userInfo = userInfo;
      });
  }

  ngOnInit() {
    this.itemName = 'chat';
    this.getFirstMessages();
  }

  public isToday(date: Date): boolean {
    const today = new Date();
    return moment(date).isSame(today, 'day');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setScrollStylesForMobile() {
    const componentHeight = window.innerHeight;
    if (this.isMobile) {
      this.scrollStyles = { height: componentHeight - 104 + 'px' };
    }
  }

  get isMobile(): boolean {
    return window.innerWidth < 1200;
  }

  getFirstMessages() {
    this.chatService
      .findAllChatMessages()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(messages => {
        if (messages.length) {
          this.dateChatItems = messages;
          this.addTodayIfNecessary();
          this.cdr.detectChanges();
          setTimeout(() => {
            this.onScrollToBottom();
          }, 200);
        }
      });
  }

  /**
   * to work properly we must be sure we have today wrapper to accept socket messages
   */
  addTodayIfNecessary() {
    const index = this.dateChatItems.length - 1;

    if (!this.isToday(new Date(this.dateChatItems[index].date))) {
      this.dateChatItems.push(new DateChatItem(new Date()));
    }
  }

  onSendChatMessage(message: HTMLInputElement) {
    const body = message.value;
    const email = this.userInfo && this.userInfo.username;
    if (body) {
      this.chatService
        .sendNewMessage(body, email)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            // console.log(res);
            message.value = '';
            this.cdr.detectChanges();
          },
          error1 => {
            // console.log(error1);
            this.cdr.detectChanges();
          }
        );
    }
  }

  welcomeToOurChannel() {
    window.open('https://t.me/exrates_official', '_blank');
  }

  onScrollToBottom() {
    this.scrollWrapper.directiveRef.update();
    this.scrollWrapper.directiveRef.scrollToBottom(0, 300);
  }
}
