import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UserVerificationService} from '../../shared/services/user-verification.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  constructor(private popupService: PopupService,
              private verificationService: UserVerificationService) { }

  ngOnInit() {
  }

  onOpenIdentityPopup(mode: string) {

    this.verificationService.setVerificationMode(mode);
    this.popupService.showIdentityPopup(mode);
  }

}
