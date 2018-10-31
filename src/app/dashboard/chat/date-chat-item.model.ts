import {ChatItem} from './chat-item.model';
import {IDateChat} from './chat.service';

export class DateChatItem implements IDateChat {

  date: Date;
  messages: ChatItem[];

  constructor(date: Date) {
    this.date = date;
    this.messages = [];
  }

}
