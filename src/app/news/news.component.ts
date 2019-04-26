import { Component, OnInit } from '@angular/core';
import {PopupService} from '../shared/services/popup.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor(
    public popupService: PopupService,
  ) { }

  ngOnInit() {
  }

  // temp method
  openSubPopup() {
    this.popupService.toggleNewsSubscribePopup(true);
  }


}
