import {ChatItem} from './chat-item.model';

export class SimpleChat {

  constructor(public email: string,
              public body: string,
              public messageTime: string) {
  }

  static fromChatItem(item: ChatItem): SimpleChat {
    return new SimpleChat(item.nickname, item.body, item.time);
  }

  static fromString(massage: string) {
    const item: SimpleChat = new SimpleChat(
                                            JSON.parse(massage).email,
                                            JSON.parse(massage).body,
                                            JSON.parse(massage).messageTime);
    return item;
  }
}
/*

[
  {
    "orderType":"SELL",
    "lastExrate":"465236.34",
    "positive":false,
    "orderBookItems":[
      {
        "currencyPairId":1,
        "orderType":"SELL",
        "exrate":"537456.535",
        "amount":"23.5"
      },
      {
        "currencyPairId":1,
        "orderType":"SELL",
        "exrate":"537456.535",
        "amount":"23.5"
      },
      {
        "currencyPairId":1,
        "orderType":"SELL",
        "exrate":"537456.535",
        "amount":"23.5"
      },
      {
        "currencyPairId":1,
        "orderType":"SELL",
        "exrate":"537456.535",
        "amount":"23.5"
      }
    ]
  },
  {
    "orderType":"BUY",
    "lastExrate":"465236.34",
    "positive":false,
    "orderBookItems":[
      {
        "currencyPairId":1,
        "orderType":"BUY",
        "exrate":"537456.535",
        "amount":"23.5"
      },
      {
        "currencyPairId":1,
        "orderType":"BUY",
        "exrate":"537456.535",
        "amount":"23.5"
      },
      {
        "currencyPairId":1,
        "orderType":"BUY",
        "exrate":"537456.535",
        "amount":"23.5"
      },
      {
        "currencyPairId":1,
        "orderType":"BUY",
        "exrate":"537456.535",
        "amount":"23.5"
      }
    ]
  }
]*/
