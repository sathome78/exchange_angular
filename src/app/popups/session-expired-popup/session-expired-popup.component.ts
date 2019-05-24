import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-session-expired-popup',
  templateUrl: './session-expired-popup.component.html',
  styleUrls: ['./session-expired-popup.component.scss'],
})
export class SessionExpiredPopupComponent implements OnInit {

  @Input() message;
  public showHtml;
  public buttonText;

  private defaultMessage;

  constructor(
    private popupService: PopupService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.buttonText = this.translateService.instant('Ok');
    this.defaultMessage = `<p>${this.translateService.instant('Your session has expired. Please log in.')}</p>`;
    this.showHtml = this.defaultMessage;
  }

  buttonClick() {
    this.closeMe();
  }

  closeMe() {
    this.popupService.toggleSessionExpiredPopup(false);
  }

}
