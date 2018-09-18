import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PopupService} from '../../services/popup.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {

  form: FormGroup;
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  isPasswordVisible = false;

  constructor(private popupService: PopupService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.emailRegex)],
        updateOn: 'blur'
      }),
      'password': new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
    });
  }

  closeMe() {
    this.popupService.closeLoginPopup();
  }

  onSubmit() {

  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}
