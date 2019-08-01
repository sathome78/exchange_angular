import { ChatItem } from './chat-item.model';
import { IDateChat } from './chat.service';
import { SimpleChat } from './simple-chat.model';

export class DateChatItem implements IDateChat {
  date: Date;
  messages: SimpleChat[];

  constructor(date: Date) {
    this.date = date;
    this.messages = [];
  }
}
