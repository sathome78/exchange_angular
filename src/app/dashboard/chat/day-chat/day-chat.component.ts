import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DateChatItem} from '../date-chat-item.model';
import {ChatItem} from '../chat-item.model';
import {ChatService} from '../chat.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-day-chat',
  templateUrl: './day-chat.component.html',
  styleUrls: ['./day-chat.component.scss']
})
export class DayChatComponent implements OnInit, OnDestroy {

  @Input () dateChatItem: DateChatItem;

  messages: ChatItem[];
  newMessagesSubscription: Subscription;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages = this.dateChatItem.messages;
    if (this.dateChatItem.date === new Date()) {
      this.chatService.setStompSubscription('en');
      this.newMessagesSubscription = this.chatService.simpleChatListener.subscribe(newMessages => {
        this.messages.push(...newMessages);
      });
    }
  }

  ngOnDestroy(): void {
     if (this.newMessagesSubscription) {
       this.newMessagesSubscription.unsubscribe();
     }
  }

}
