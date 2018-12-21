import {Component, Input, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-demo-trading-popup',
  templateUrl: './demo-trading-popup.component.html',
  styleUrls: ['./demo-trading-popup.component.scss']
})
export class DemoTradingPopupComponent implements OnInit {

  @Input() message;
  public showHtml;
  public buttonText = 'Continue trading';

  private defautMessage = `<p>Unfortunately now you are not able to trade on this version of the website.</p>
      <p>Now you have an opportunity to test a redesigned demo version go the dashboard.
       After all the tests are conducted, the updated dashboard will be available for real trading!</p>`;

  private notWork = `<p>Unfortunately, for this moment there is no opportunity to continue desired action on current version of site.
  Please, go to <a href="https://exrates.me">exrates.me</a> to proceed your action.</p>`;

  constructor(
    private popupService: PopupService,
  ) {
  }

  ngOnInit() {
    switch (this.message) {
      case 0:
        this.showHtml = this.defautMessage;
        break;
      case 1:
        this.showHtml = this.notWork;
        this.buttonText = 'Continue'
        break;
    }
  }

  buttonClick() {
    switch (this.message) {
      case 0:
        this.closeMe();
        break;
      case 1:
        location.href = 'https://exrates.me'
        break;
    }
  }

  closeMe() {
    this.popupService.closeDemoTradingPopup();
  }

}
