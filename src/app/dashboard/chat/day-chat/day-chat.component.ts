import {Component, Input, OnInit} from '@angular/core';
import {DateChatItem} from '../date-chat-item.model';
import {ChatItem} from '../chat-item.model';

@Component({
  selector: 'app-day-chat',
  templateUrl: './day-chat.component.html',
  styleUrls: ['./day-chat.component.scss']
})
export class DayChatComponent implements OnInit {

  @Input () dateChatItem: DateChatItem;

  messages: ChatItem[];

  constructor() { }

  ngOnInit() {
    this.messages = this.dateChatItem.messages;
    if (this.dateChatItem.date === new Date()) {
      console.log('today');
    }
  }

}
