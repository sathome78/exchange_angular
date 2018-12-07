import {Component, OnInit} from '@angular/core';
import {OnNextStep, PopupService} from '../../../../shared/services/popup.service';
import {GoogleAuthenticatorService} from '../google-authenticator.service';
import {ITwoFaResponseDto, TwoFaResponseDto} from '../2fa-response-dto.model';
import {AuthService} from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-google-step-two',
  templateUrl: './google-step-two.component.html',
  styleUrls: ['./google-step-two.component.scss']
})
export class GoogleStepTwoComponent implements OnInit, OnNextStep {

  secretCode = '';
  statusMessage = '';

  constructor(private popupService: PopupService,
              private googleService: GoogleAuthenticatorService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.googleService.getGoogleTwoFaSecretHash().subscribe((dto: TwoFaResponseDto) => {
        console.log(dto);
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
    this.popupService.moveNextStep();
  }

  getGoogleAuthenticatorUrl(): string {
    return 'https://zxing.org/w/chart?cht=qr&chs=250x250&chld=M&choe=UTF-8&chl=otpauth://totp/Exrates:'
      + this.authService.getUsername()
      + '?secret=' + this.secretCode;
    // return 'otpauth://totp/%s:%s?secret=%s&issuer=%s'
  }
}
