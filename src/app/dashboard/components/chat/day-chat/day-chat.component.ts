import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DateChatItem} from '../date-chat-item.model';
import {ChatItem} from '../chat-item.model';
import {ChatService} from '../chat.service';
import {Subscription} from 'rxjs';
import {SimpleChat} from '../simple-chat.model';
import {ChatComponent} from '../chat.component';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-day-chat',
  templateUrl: 'day-chat.component.html',
  styleUrls: ['day-chat.component.scss']
})
export class DayChatComponent implements OnInit, OnDestroy {

  @Input () dateChatItem: DateChatItem;
  @Input () scrollWrapper: PerfectScrollbarComponent;

  messages: SimpleChat[];
  newMessagesSubscription = new Subscription();

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages = this.dateChatItem.messages;
    if (ChatComponent.isToday(new Date(this.dateChatItem.date))) {
      this.chatService.setStompSubscription('en');
      this.newMessagesSubscription = this.chatService.simpleChatListener.subscribe(msg => {
        this.messages = [...this.messages, msg];
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
    this.chatService.unsubscribeStomp();
     if (this.newMessagesSubscription) {
       this.newMessagesSubscription.unsubscribe();
     }
  }



}
