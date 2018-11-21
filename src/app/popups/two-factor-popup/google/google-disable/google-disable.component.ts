import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GoogleAuthenticatorService} from '../google-authenticator.service';
import {PopupService} from '../../../../services/popup.service';

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
    this.sendMePincode();
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
