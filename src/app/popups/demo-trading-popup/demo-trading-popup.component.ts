import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';

@Component({
  selector: 'app-demo-trading-popup',
  templateUrl: './demo-trading-popup.component.html',
  styleUrls: ['./demo-trading-popup.component.scss']
})
export class DemoTradingPopupComponent implements OnInit {

  constructor(
    private popupService: PopupService,
  ) { }

  ngOnInit() {
  }

  closeMe() {
    this.popupService.closeDemoTradingPopup();
  }

}
