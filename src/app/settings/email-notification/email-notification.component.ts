import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-email-notification',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.scss']
})
export class EmailNotificationComponent implements OnInit {

  ORDER_TYPE = 'ORDER';
  IN_OUT_TYPE = 'IN_OUT';
  CUSTOM_TYPE = 'CUSTOM';
  ADMIN_TYPE = 'ADMIN';
  ACCOUNT_TYPE = 'ACCOUNT';

  isInOutNotificationEnabled = false;
  isOrdersNotificationEnabled = false;
  isAccountChangesEnabled = false;
  isAdminNotificationEnabled = false;
  isOtherMessagesEnabled = false;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.loadNotifications();
  }

  update() {
    this.settingsService.updateEmailNotifications(this.getOptions())
      .subscribe(resp => {
          console.log('updated');
        },
        err => {
          console.log(err);
        });
  }

  updateInOuts() {
    this.isInOutNotificationEnabled = !this.isInOutNotificationEnabled;
    this.update();
  }

  updateOrders() {
    this.isOrdersNotificationEnabled = !this.isOrdersNotificationEnabled;
    this.update();
  }

  updateAccount() {
    this.isAccountChangesEnabled = !this.isAccountChangesEnabled;
    this.update();
  }

  updateAdmin() {
    this.isAdminNotificationEnabled = !this.isAdminNotificationEnabled;
    this.update();
  }

  updateCustom() {
    this.isOtherMessagesEnabled = !this.isOtherMessagesEnabled;
    this.update();
  }

  getOptions(): NotificationOption [] {
    const options = [];
    options.push(NotificationOption.create(this.ORDER_TYPE, this.isOrdersNotificationEnabled));
    options.push(NotificationOption.create(this.IN_OUT_TYPE, this.isInOutNotificationEnabled));
    options.push(NotificationOption.create(this.CUSTOM_TYPE, this.isOtherMessagesEnabled));
    options.push(NotificationOption.create(this.ACCOUNT_TYPE, this.isAccountChangesEnabled));
    options.push(NotificationOption.create(this.ADMIN_TYPE, this.isAdminNotificationEnabled));
    return options;
  }

  private loadNotifications() {
    this.settingsService.getEmailNotifications()
      .subscribe(map => {
        this.isInOutNotificationEnabled = map[this.IN_OUT_TYPE];
        this.isOrdersNotificationEnabled = map[this.ORDER_TYPE];
        this.isAccountChangesEnabled = map[this.ACCOUNT_TYPE];
        this.isAdminNotificationEnabled = map[this.ADMIN_TYPE];
        this.isOtherMessagesEnabled = map[this.CUSTOM_TYPE];
      });
  }
}

export class NotificationOption {

  public event: string;
  public userId = 0;
  public sendNotification = false;
  public sendEmail: boolean;
  public eventLocalized = '';

  constructor() {
  }

  public static create(eventType: string, emailValue: boolean): NotificationOption {
    const option = new NotificationOption();
    option.event = eventType;
    option.sendEmail = emailValue;
    return option;
  }

}
