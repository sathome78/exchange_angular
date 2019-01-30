import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Animations} from '../../shared/animations';
import {PopupService} from '../../shared/services/popup.service';

@Component({
  selector: 'app-kyc-popup',
  templateUrl: './kyc-popup.component.html',
  styleUrls: ['./kyc-popup.component.scss'],
  animations: [
    Animations.popupOverlayTrigger, Animations.popupModalTrigger
  ]
})
export class KycPopupComponent implements OnInit {

  @Input() showPopup;
  @Input() step = 1;
  public iframeUrl = '';

  constructor(
    private popupService: PopupService,
  ) { }

  ngOnInit() {
  }

  closeMe() {
    this.popupService.closeKYCPopup();
  }

  goToSecondStep(event) {
    this.iframeUrl = event;
    this.step = 2;
  }
}
