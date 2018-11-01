import {ChatItem} from './chat-item.model';

export class SimpleChat {

  constructor(public email: string,
              public body: string,
              public messageTime: string) {
  }

  static fromChatItem(item: ChatItem): SimpleChat {
    return new SimpleChat(item.nickname, item.body, item.time);
  }
}
