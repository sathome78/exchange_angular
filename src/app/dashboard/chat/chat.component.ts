import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {ChatService} from './chat.service';
import {SimpleChat} from './simple-chat.model';
import {Subscription} from 'rxjs';
import {DateChatItem} from './date-chat-item.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  // todo please implement sorting as backend returns sorted by date ascending with limit of 50 messages
  dateChatItems: DateChatItem [];

  constructor(private chatService: ChatService,
              private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'chat';
    // this.chatService.findAllChatMessages().subscribe(messages => {
    //   // console.log(messages);
    //   if (messages.length) {
    //     this.dateChatItems = messages;
    //     this.addTodayIfNecessary();
    //   }
    // });
    // console.log(this.dateChatItems);
  }

  /**
   * to work properly we must be sure we have today wrapper to accept socket messages
   */
  addTodayIfNecessary() {
    const index = this.dateChatItems.length - 1;
    if (this.dateChatItems[index].date !== new Date()) {
      this.dateChatItems.push(new DateChatItem(new Date()));
    }
  }

  onSendChatMessage(message: HTMLInputElement) {
    const body = message.value;
    const email = this.authService.getUsername();
    if (body) {
      this.chatService.sendNewMessage(body, email)
        .subscribe(res => {
            console.log(res);
            message.value = '';
          },
          error1 => {
            console.log(error1);
          });
    }
  }
}
