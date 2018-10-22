
export class ChatItem {

  constructor( public id: number,
               public userId: number,
               public nickname: string,
               public body: string,
               public time: string) { }


  static fromString(massage: string) {
    const item: ChatItem = new ChatItem(
                                          JSON.parse(massage).id,
                                          JSON.parse(massage).userId,
                                          JSON.parse(massage).nickname,
                                          JSON.parse(massage).body,
                                          JSON.parse(massage).time
                                        );
    return item;
  }

}
