export class Notification {
  public viewed: boolean = false;
  public id: number = Date.now()  + Math.random();
  public text: string;
  public notificationType: string;

  constructor(
    private notification: any,
  ) {
    this.text = this.notification.text;
    this.notificationType = this.notification.notificationType;
  }

  public markAsViewed() {
    this.viewed = true;
  }


}
