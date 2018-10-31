
export class ChatItem {

  constructor( public email: string,
               public body: string,
               public messageTime: string) { }


  static fromString(massage: string) {
    const item: ChatItem = new ChatItem(
                                          JSON.parse(massage).email,
                                          JSON.parse(massage).body,
                                          JSON.parse(massage).messageTime
                                        );
    return item;
  }

}
