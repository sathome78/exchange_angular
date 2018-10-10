import { Component, OnInit } from '@angular/core';
import {OnNextStep, PopupService} from '../../../../services/popup.service';
import {TwoFaResponseDto} from '../2fa-response-dto.model';
import {GoogleAuthenticatorService} from '../google-authenticator.service';

@Component({
  selector: 'app-google-step-three',
  templateUrl: './google-step-three.component.html',
  styleUrls: ['./google-step-three.component.scss']
})
export class GoogleStepThreeComponent implements OnInit, OnNextStep {

  secretCode = '';
  statusMessage = '';

  constructor(private popupService: PopupService,
              private googleService: GoogleAuthenticatorService) { }

  ngOnInit() {
    this.googleService.getGoogleTwoFaSecretHash().subscribe((dto: TwoFaResponseDto) => {
        // console.log(dto);
        this.secretCode = dto.message;
        if (dto.error) {
          this.statusMessage = dto.error;
        }
      },
      err => {
        this.statusMessage = 'Failed to get google url';
        console.log(err);
      });
  }

  onNextStep() {
    this.popupService.closeTFAPopup();
    // this.popupService.moveNextStep();
  }

}
