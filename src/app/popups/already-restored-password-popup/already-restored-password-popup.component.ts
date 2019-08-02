import { Component, OnInit, Input } from '@angular/core';
import { PopupService } from 'app/shared/services/popup.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-already-restored-password-popup',
  templateUrl: './already-restored-password-popup.component.html',
  styleUrls: ['./already-restored-password-popup.component.scss'],
})
export class AlreadyRestoredPasswordPopupComponent implements OnInit {
  @Input() message;
  public showHtml;
  public buttonText;

  private defaultMessage;

  constructor(private popupService: PopupService, private translateService: TranslateService) {}

  ngOnInit() {
    this.buttonText = this.translateService.instant('Ok');
    this.defaultMessage = `<p>${this.translateService.instant(
      'You have already used the link to reset your password. If necessary, please repeat the password recovery process.'
    )}</p>`;
    this.showHtml = this.defaultMessage;
  }

  buttonClick() {
    this.closeMe();
  }

  closeMe() {
    this.popupService.toggleAlreadyRestoredPasswordPopup(false);
  }
}
