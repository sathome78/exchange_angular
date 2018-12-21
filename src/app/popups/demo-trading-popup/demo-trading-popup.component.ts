import {Component, Input, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';

@Component({
  selector: 'app-demo-trading-popup',
  templateUrl: './demo-trading-popup.component.html',
  styleUrls: ['./demo-trading-popup.component.scss']
})
export class DemoTradingPopupComponent implements OnInit {

  @Input() message;
  public showHtml;

  private defautMessage = `<p>Unfortunately now you are not able to trade on this version of the website.</p>
      <p>Now you have an opportunity to test a redesigned demo version go the dashboard. After all the tests are
        conducted, the updated dashboard will be available for real trading!</p>`;

  // private notWork = `<p>This functionality is at the stage of development.</p> <p>These functions are available on <a href="https://exrates.me" class="link">exrates.me</a></p>`;
  private notWork = `<p>Unfortunately, for this moment there is no opportunity to continue desired action on current version of site. Please, go to <a
href="https://exrates.me" class="link link--underline">exrates.me</a> to proceed your action.</p>`;

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
        break;
    }
  }

  closeMe() {
    this.popupService.closeDemoTradingPopup();
  }

}
