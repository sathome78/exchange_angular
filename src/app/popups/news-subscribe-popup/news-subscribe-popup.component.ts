import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';

@Component({
  selector: 'app-news-subscribe-popup',
  templateUrl: './news-subscribe-popup.component.html',
  styleUrls: ['./news-subscribe-popup.component.scss']
})
export class NewsSubscribePopupComponent implements OnInit {

  constructor(
    public popupService: PopupService,
  ) { }

  ngOnInit() {
  }

  // temp method
  openThankPopup() {
    this.popupService.toggleNewsThankYouPopup(true);
  }

  // temp method
  closeSubPopup() {
    this.popupService.toggleNewsSubscribePopup(false);
  }

}
