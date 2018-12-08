import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GoogleAuthenticatorService} from '../google-authenticator.service';
import {PopupService} from '../../../../shared/services/popup.service';

@Component({
  selector: 'app-google-disable',
  templateUrl: './google-disable.component.html',
  styleUrls: ['./google-disable.component.scss']
})
export class GoogleDisableComponent implements OnInit {

  statusMessage = '';
  form: FormGroup;
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

  constructor(private popupService: PopupService,
              private googleService: GoogleAuthenticatorService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl('', {validators: [Validators.required, Validators.pattern(this.emailRegex)]}),
      'password': new FormControl('', {validators: [Validators.required]}),
      'pincode': new FormControl('', {validators: [Validators.required]})
    });
    // this.sendMePincode();
  }

  // sendMePincode() {
  //   this.googleService.sendMePincode().subscribe(res => {
  //       // console.log(res);
  //     },
  //     error1 => {
  //       console.log(error1);
  //     });
  // }

  disableGoogleAuth() {
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;
      const pincode = this.form.get('pincode').value;
      this.googleService.disableGoogleAuthentication(email, password, pincode)
        .subscribe(res => {
          // console.log(res);
          this.popupService.closeTFAPopup();
        },
        error1 => {
          console.log(error1);
        });
    } else {
      console.log('2FaGoogle Disable form is invalid');
    }
  }

}
