import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../shared/services/popup.service';
import { PopupData } from '../../shared/interfaces/popup-data-interface';

@Component({
  selector: 'app-popup-info',
  templateUrl: './popup-info.component.html',
  styleUrls: ['./popup-info.component.scss'],
})
export class PopupInfoComponent implements OnInit {
  @Input() popupData: PopupData;

  constructor(public popupService: PopupService) {}

  ngOnInit() {}

  closeMe() {
    this.popupService.toggleInfoPopup(null);
  }
}
