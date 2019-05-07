import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';

@Component({
  selector: 'app-news-thank-you-popup',
  templateUrl: './news-thank-you-popup.component.html',
  styleUrls: ['./news-thank-you-popup.component.scss']
})
export class NewsThankYouPopupComponent implements OnInit {

  constructor(
    public popupService: PopupService,
  ) { }

  ngOnInit() {
  }

  closeThankPopup() {
    this.popupService.toggleNewsThankYouPopup(false);
  }
}
