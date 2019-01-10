import {Component, OnInit} from '@angular/core';
import {OnNextStep, PopupService} from '../../../../shared/services/popup.service';
import {TwoFaResponseDto} from '../2fa-response-dto.model';
import {GoogleAuthenticatorService} from '../google-authenticator.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-google-step-three',
  templateUrl: './google-step-three.component.html',
  styleUrls: ['./google-step-three.component.scss']
})
export class GoogleStepThreeComponent implements OnInit, OnNextStep {

  secretCode = '';
  statusMessage = '';
  form: FormGroup;

  constructor(private popupService: PopupService,
              private googleService: GoogleAuthenticatorService) {
  }

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
    this.form = new FormGroup({
      'email': new FormControl('', {validators: [Validators.required]}),
      'password': new FormControl('', {validators: [Validators.required]}),
      'pincode': new FormControl('', {validators: [Validators.required]})
    });
    this.sendMePincode();
  }

  onNextStep() {
    this.popupService.closeTFAPopup();
    // this.popupService.moveNextStep();
    const password = this.form.get('password').value;
    const pin = this.form.get('pincode').value;
    this.googleService.submitGoogleAuthSecret(this.secretCode, password, pin)
      .subscribe(res => {
          console.log(res);
          this.popupService.closeTFAPopup();
        },
        error1 => {
          this.statusMessage = 'Failed to set your google auth code';
          console.log(error1);
        });
  }

  sendMePincode() {
    this.googleService.sendMePincode().subscribe(res => {
        console.log(res);
      },
      error1 => {
        console.log(error1);
      });
  }

}
