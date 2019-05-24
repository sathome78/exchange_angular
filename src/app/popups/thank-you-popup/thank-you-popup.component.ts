import { Component, Input, OnInit } from '@angular/core';
import { ThankPopupModel } from '../../shared/models/thank-popup-model';
import { PopupService } from '../../shared/services/popup.service';

@Component({
  selector: 'app-thank-you-popup',
  templateUrl: './thank-you-popup.component.html',
  styleUrls: ['./thank-you-popup.component.scss'],
})
export class ThankYouPopupComponent implements OnInit {

  @Input('popupData') public popupData: ThankPopupModel;

  constructor(
    public popupService: PopupService,
  ) { }

  ngOnInit() {
  }

  closeMe() {
    this.popupService.getThankYouPopupListener().next({ title: '', subTitle: '', isOpen: false });
  }

}
