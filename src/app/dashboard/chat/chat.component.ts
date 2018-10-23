import {Component, OnDestroy, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {ChatService} from './chat.service';
import {SimpleChat} from './simple-chat.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;


  // todo please implement sorting as backend returns sorted by date ascending with limit of 50 messages
  public simpleChatItems: SimpleChat [] = [];

  private newMessagesSubscription: Subscription;

  constructor(private chatService: ChatService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'chat';
    this.chatService.setStompSubscription('en');
    this.chatService.findAllChatMessages().subscribe(messages => {
      console.log(messages);
      this.simpleChatItems = messages;
    });
    this.newMessagesSubscription = this.chatService.simpleChatListener.subscribe(newMessages => {
      this.simpleChatItems.push(...newMessages);
    });
  }

  ngOnDestroy() {
    this.chatService.unsubscribeStomp();
    this.newMessagesSubscription.unsubscribe();
  }

  onSendChatMessage(message: string) {
    this.chatService.sendNewMessage(message)
      .subscribe(res => {
          console.log(res);
        },
        error1 => {
          console.log(error1);
        });
  }

}
