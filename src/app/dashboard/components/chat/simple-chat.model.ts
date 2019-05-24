export class SimpleChat {

  constructor(public email: string,
              public body: string,
              public messageTime: string,
              public messageReplyUsername: string,
              public messageReplyText: string) {
  }
  static fromString(massage: string) {
    return new SimpleChat(JSON.parse(massage).email,
                          JSON.parse(massage).body,
                          JSON.parse(massage).messageTime,
                          JSON.parse(massage).messageReplyUsername,
                          JSON.parse(massage).messageReplyText);

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
