import {Component, Input, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UserVerificationService} from '../../shared/services/user-verification.service';
import {Animations} from '../../shared/animations';

@Component({
  selector: 'app-identity-popup',
  templateUrl: './identity-popup.component.html',
  styleUrls: ['./identity-popup.component.scss'],
  animations: [
    Animations.popupOverlayTrigger, Animations.popupModalTrigger
  ]
})
export class IdentityPopupComponent implements OnInit {

  @Input() showPopup;
  step = 1;
  stepsSize = 1;


  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  closeMe() {
    this.popupService.closeIdentityPopup();
  }

  moveNext(step: number) {
    this.step = step;
  }
}
