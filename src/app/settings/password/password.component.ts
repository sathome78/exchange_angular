import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoggingService} from '../../services/logging.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  form: FormGroup;
  passwordFirst: FormControl;
  isPasswordVisible: boolean;

  constructor(private logger: LoggingService) { }

  ngOnInit() {
    this.passwordFirst = new FormControl(null, {
      validators: [Validators.required, Validators.pattern('^((?=.*\\d)(?=.*[a-zA-Z]).{8,20})$')],
      updateOn: 'blur'
    });
    this.form = new FormGroup({
      'password_1': this.passwordFirst,
      'password_2': new FormControl(null, {
        validators: [Validators.required, this.unmatchingPasswords.bind(this)],
        updateOn: 'blur'
      }),
    });
  }

  unmatchingPasswords(password_2: FormControl): {[s: string]: boolean} {
    if (this.passwordFirst.value === password_2.value) {
      return null;
    }
    return { 'passwordsDiffer': true };
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    this.logger.debug(this, 'Attempt to submit login and password');
  }


  getInputType() {
    return this.isPasswordVisible ? 'text' : 'password';
  }
}
