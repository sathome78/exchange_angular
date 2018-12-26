import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {AbstractDashboardItems} from '../../abstract-dashboard-items';
import {ChatService} from './chat.service';
import {DateChatItem} from './date-chat-item.model';
import {AuthService} from 'app/shared/services/auth.service';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss']
})
export class ChatComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  // todo please implement sorting as backend returns sorted by date ascending with limit of 50 messages
  dateChatItems: DateChatItem [];

  // retrive Element to handle scroll in chat
  @ViewChild('scrollWrapper') scrollWrapper: PerfectScrollbarComponent;
  public scrollStyles: any = null;

  static isToday(date: Date): boolean {
    const today = new Date();
    return today.getFullYear() === date.getFullYear()
      && today.getMonth() === date.getMonth()
      && today.getDate() === date.getDate();
  }

  constructor(private chatService: ChatService,
              private authService: AuthService) {
    super();
    this.setScrollStylesForMobile();
  }

  ngOnInit() {
    this.itemName = 'chat';
    this.getFirstMessages();
  }



  setScrollStylesForMobile() {
    const componentHeight = window.innerHeight;
    if(this.isMobile) {
      this.scrollStyles = {'height': (componentHeight - 104) + 'px'}
    }
  }

  get isMobile(): boolean {
    return window.innerWidth < 1200
  }

  getFirstMessages() {
    this.chatService.findAllChatMessages().subscribe(messages => {
      if (messages.length) {
        this.dateChatItems = messages;
        this.addTodayIfNecessary();
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

    if (!ChatComponent.isToday(new Date(this.dateChatItems[index].date))) {
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

  welcomeToOurChannel() {
    window.open('https://t.me/exrates_official', '_blank');
  }

  onScrollToBottom() {
    this.scrollWrapper.directiveRef.update();
    this.scrollWrapper.directiveRef.scrollToBottom(0, 300);
  }


}
