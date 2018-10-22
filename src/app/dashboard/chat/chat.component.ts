import {Component, OnDestroy, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {ChatService} from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends AbstractDashboardItems implements OnInit, OnDestroy {
  /** dashboard item name (field for base class)*/
  public itemName: string;


  constructor(private chatService: ChatService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'chat';
    this.chatService.setStompSubscription('en');
  }

  ngOnDestroy() {
    this.chatService.unsubscribeStomp();
  }

}
