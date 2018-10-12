import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {UserVerificationModel} from './user-verification.model';

@Component({
  selector: 'app-identity-popup',
  templateUrl: './identity-popup.component.html',
  styleUrls: ['./identity-popup.component.scss']
})
export class IdentityPopupComponent implements OnInit {

  step = 1;
  stepsSize = 1;
  verificationEntity: UserVerificationModel


  constructor(private popupService: PopupService) { }

  ngOnInit() {
  }

  closeMe() {
    this.popupService.closeIdentityPopup();
  }

  moveNext(step: number) {
    this.step = step;
  }

  saveVerificationEntity(data: UserVerificationModel) {
    this.verificationEntity = data;
  }
}
