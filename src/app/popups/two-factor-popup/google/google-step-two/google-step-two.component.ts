import {Component, OnInit} from '@angular/core';
import {OnNextStep, PopupService} from '../../../../services/popup.service';
import {GoogleAuthenticatorService} from '../google-authenticator.service';
import {TwoFaResponseDto} from '../2fa-response-dto.model';

@Component({
  selector: 'app-google-step-two',
  templateUrl: './google-step-two.component.html',
  styleUrls: ['./google-step-two.component.scss']
})
export class GoogleStepTwoComponent implements OnInit, OnNextStep {

  googleUrl = '';
  statusMessage = '';

  constructor(private popupService: PopupService,
              private googleService: GoogleAuthenticatorService) {
  }

  ngOnInit() {
    this.googleService.getGoogleTwoFaUrl().subscribe((dto: TwoFaResponseDto) => {
      // console.log(dto);
        if (dto.message) {
          this.googleUrl = dto.message;
        }
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
    this.popupService.moveNextStep();
  }

  getGoogleUrl() {
    return this.googleUrl;
  }
}
