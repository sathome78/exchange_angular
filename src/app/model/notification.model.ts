export class Notification {
  public title: string;
  public message: string;

  constructor(private notification: any) {
    this.message = this.notification.text;
    this.title = this.notification.notificationType;
  }
}
