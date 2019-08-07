import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-demo-trading-popup',
  templateUrl: './demo-trading-popup.component.html',
  styleUrls: ['./demo-trading-popup.component.scss'],
})
export class DemoTradingPopupComponent implements OnInit {
  @Input() message;
  public showHtml;
  public buttonText;

  private defautMessage;
  private notWork;

  constructor(private popupService: PopupService, private translateService: TranslateService) {}

  ngOnInit() {
    this.initFields();

    switch (this.message) {
      case 0:
        this.showHtml = this.defautMessage;
        break;
      case 1:
        this.showHtml = this.notWork;
        this.buttonText = this.translateService.instant('Continue');
        break;
    }
  }

  buttonClick() {
    switch (this.message) {
      case 0:
        this.closeMe();
        break;
      case 1:
        window.open('https://exrates.me', '_blank');
        this.closeMe();
        break;
    }
  }

  closeMe() {
    this.popupService.closeDemoTradingPopup();
  }

  private initFields() {
    this.buttonText = this.translateService.instant('Continue trading');

    this.defautMessage = `<p>${this.translateService.instant(
      'Unfortunately now you are not able to trade on this version of the website.'
    )}</p>
     <p>${this.translateService.instant(
       'Now you have an opportunity to test a redesigned demo version go the dashboard.' +
         ' After all the tests are conducted, the updated dashboard will be available for real trading!'
     )}</p>`;
    this.notWork = `<p>${this.translateService.instant(
      'Unfortunately, for this moment there is no opportunity to continue desired action on current version of site. Please, go to <a href="https://exrates.me" class="link link--underline" target="_blank" rel="nofollow noopener noreferrer">exrates.me</a> to proceed your action.'
    )}</p>`;
  }
}
