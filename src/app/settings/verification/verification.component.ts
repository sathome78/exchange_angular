import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {UserVerificationService} from '../../shared/services/user-verification.service';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  constructor(private popupService: PopupService,
              private verificationService: UserVerificationService,
              private settingsService: SettingsService
              ) { }

  ngOnInit() {
    // this.settingsService.getCurrentVerificationStatusKYC().subscribe(res => console.log(res));
    // this.settingsService.getCountriesKYC().subscribe(res => console.log(res));
    // this.settingsService.getLanguagesKYC().subscribe(res => console.log(res));
  }

  onOpenIdentityPopup(mode: string) {

    this.verificationService.setVerificationMode(mode);
    this.popupService.showIdentityPopup(mode);
  }

}
