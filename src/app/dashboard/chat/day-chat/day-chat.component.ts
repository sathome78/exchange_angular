import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DateChatItem} from '../date-chat-item.model';
import {ChatItem} from '../chat-item.model';
import {ChatService} from '../chat.service';
import {Subscription} from 'rxjs';
import {SimpleChat} from '../simple-chat.model';

@Component({
  selector: 'app-day-chat',
  templateUrl: './day-chat.component.html',
  styleUrls: ['./day-chat.component.scss']
})
export class DayChatComponent implements OnInit, OnDestroy {

  @Input () dateChatItem: DateChatItem;

  messages: SimpleChat[];
  newMessagesSubscription: Subscription;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages = this.dateChatItem.messages;
    if (this.dateChatItem.date === new Date()) {
      this.chatService.setStompSubscription('en');
      this.newMessagesSubscription = this.chatService.simpleChatListener.subscribe(msg => {
        this.messages.push(msg);
      });
    }
  }

  ngOnDestroy(): void {
     if (this.newMessagesSubscription) {
       this.newMessagesSubscription.unsubscribe();
     }
  }



}
