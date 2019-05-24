import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-changed-popup',
  templateUrl: './password-changed-popup.component.html',
  styleUrls: ['./password-changed-popup.component.scss'],
})
export class PasswordChangedPopupComponent implements OnInit {

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
    this.defaultMessage = `<p>${this.translateService.instant('Password successfully changed.')}</p>`;
    this.showHtml = this.defaultMessage;
  }

  buttonClick() {
    this.closeMe();
  }

  closeMe() {
    this.popupService.toggleChangedPasswordPopup(false);
  }

}
