import {Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {DateChatItem} from '../date-chat-item.model';
import {ChatItem} from '../chat-item.model';
import {ChatService} from '../chat.service';
import {Subject} from 'rxjs';
import {SimpleChat} from '../simple-chat.model';
import {ChatComponent} from '../chat.component';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-day-chat',
  templateUrl: 'day-chat.component.html',
  styleUrls: ['day-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayChatComponent implements OnInit, OnDestroy {

  @Input () dateChatItem: DateChatItem;
  @Input () scrollWrapper: PerfectScrollbarComponent;

  messages: SimpleChat[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.messages = this.dateChatItem.messages;
    if (ChatComponent.isToday(new Date(this.dateChatItem.date))) {
      this.chatService.setStompSubscription('en');
      this.chatService.simpleChatListener
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(msg => {
          this.messages = [...this.messages, msg];
          this.cdr.detectChanges();
          setTimeout(() => {
            this.onScrollToBottom();
          }, 200);
        });
    }
  }

  onScrollToBottom() {
    this.scrollWrapper.directiveRef.scrollToBottom(0,300);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }



}
