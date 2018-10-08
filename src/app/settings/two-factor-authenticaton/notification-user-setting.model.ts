export class NotificationUserSetting {

  private static LOGIN = 'LOGIN';
  private static WITHDRAW = 'WITHDRAW';
  private static TRANSFER = 'TRANSFER';

  public userId: number;
  public notificationMessageEventEnum: string;
  public notificatorId: number;

  constructor(userId: number) {
    this.userId = userId;
    this.notificationMessageEventEnum = '';
    this.notificatorId = null;
  }

  public static builder(): NotificationUserSetting {
    return new NotificationUserSetting(0);
  }

  public build(): NotificationUserSetting {
    return this;
  }

  public withLogin(): NotificationUserSetting  {
    this.notificationMessageEventEnum = NotificationUserSetting.LOGIN;
    return this;
  }

  public withWithdraw(): NotificationUserSetting  {
    this.notificationMessageEventEnum = NotificationUserSetting.WITHDRAW;
    return this;
  }

  public withTransfer(): NotificationUserSetting  {
    this.notificationMessageEventEnum = NotificationUserSetting.TRANSFER;
    return this;
  }

  // 1	E-MAIL
  // 2	SMS
  // 3	TELEGRAM
  // 4	GOOGLE AUTHENTICATOR

  public bySMS() {
    this.notificatorId = 2;
  }

  public byEmail() {
    this.notificatorId = 1;
  }

  public byTelegram() {
    this.notificatorId = 3;
  }

  public byGoogle() {
    this.notificatorId = 4;
  }

  public disable() {
    this.notificatorId = null;
  }

}
