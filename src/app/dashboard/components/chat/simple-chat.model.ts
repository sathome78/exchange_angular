export class SimpleChat {

  constructor(public email: string,
              public body: string,
              public messageTime: string,
              public messageReplyUsername: string,
              public messageReplyText: string) {
  }
  static fromString(massage: string) {
    return new SimpleChat( JSON.parse(massage).email,
                           JSON.parse(massage).body,
                           JSON.parse(massage).messageTime,
                           JSON.parse(massage).messageReplyUsername,
                           JSON.parse(massage).messageReplyText);

  }
}
