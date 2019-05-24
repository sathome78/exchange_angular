import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-already-registered-popup',
  templateUrl: './already-registered-popup.component.html',
  styleUrls: ['./already-registered-popup.component.scss'],
})
export class AlreadyRegisteredPopupComponent implements OnInit {

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
    this.defaultMessage = `<p>${this.translateService.instant('You have already used the link to confirm your registration. If necessary, please repeat the registration process.')}</p>`;
    this.showHtml = this.defaultMessage;
  }

  buttonClick() {
    this.closeMe();
  }

  closeMe() {
    this.popupService.toggleAlreadyRegisteredPopup(false);
  }

}
