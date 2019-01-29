import {Component, OnInit} from '@angular/core';
import {OnNextStep, PopupService} from '../../../../shared/services/popup.service';
import {TwoFaResponseDto} from '../2fa-response-dto.model';
import {GoogleAuthenticatorService} from '../google-authenticator.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import * as fromCore from '../../../../core/reducers'
import * as settingsActions from '../../../../settings/store/actions/settings.actions'
import {AuthService} from 'app/shared/services/auth.service';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-google-step-three',
  templateUrl: './google-step-three.component.html',
  styleUrls: ['./google-step-three.component.scss']
})
export class GoogleStepThreeComponent implements OnInit, OnNextStep {

  secretCode = '';
  statusMessage = '';
  form: FormGroup;

  constructor(
    private popupService: PopupService,
    private googleService: GoogleAuthenticatorService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private store: Store<fromCore.State>,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.googleService.getGoogleTwoFaSecretHash().subscribe((dto: TwoFaResponseDto) => {
        // console.log(dto);
        this.secretCode = dto.message;
        if (dto.error) {
          this.statusMessage = dto.error;
        }
      },
      err => {
        this.statusMessage = this.translateService.instant('Failed to get google url');
        console.log(err);
      });
    this.form = new FormGroup({
      'email': new FormControl('', {validators: [Validators.required, this.utilsService.emailValidator()]}),
      'password': new FormControl('', {validators: [Validators.required]}),
      'pincode': new FormControl('', {validators: [Validators.required]})
    });
    this.sendMePincode();
  }

  onNextStep() {
    // this.popupService.closeTFAPopup();
    // this.popupService.moveNextStep();
    if(this.form.valid) {
      const password = this.form.get('password').value;
      const pin = this.form.get('pincode').value;
      this.googleService.submitGoogleAuthSecret(this.secretCode, password, pin)
        .subscribe(res => {
            // console.log(res);
            this.store.dispatch(new settingsActions.LoadGAStatusAction(this.authService.getUsername()))
            this.popupService.closeTFAPopup();
          },
          error1 => {
            this.statusMessage = this.translateService.instant('Failed to set your google auth code');
            console.log(error1);
          });
    }
  }

  sendMePincode() {
    this.googleService.sendMePincode().subscribe(res => {
        console.log(res);
      },
      error1 => {
        console.log(error1);
      });
  }

  get emailControl() {
    return this.form.get('email');
  }
  get passwordControl() {
    return this.form.get('password');
  }
  get pinCodeControl() {
    return this.form.get('pincode');
  }

}
