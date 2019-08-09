import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-session-time-saved-popup',
  templateUrl: './session-time-saved-popup.component.html',
  styleUrls: ['./session-time-saved-popup.component.scss'],
})
export class SessionTimeSavedPopupComponent implements OnInit {
  @Input() message;
  public showHtml;
  public buttonText;

  private defaultMessage;

  constructor(private popupService: PopupService, private translateService: TranslateService) {}

  ngOnInit() {
    this.buttonText = this.translateService.instant('Ok');
    this.defaultMessage = `<p style="text-align: center;">${this.translateService.instant('Session time was changed')}</p>`;
    this.showHtml = this.defaultMessage;
  }

  buttonClick() {
    this.closeMe();
  }

  closeMe() {
    this.popupService.toggleSessionTimeSavedPopup(false);
  }
}
