import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  passwordForm: FormGroup;
  isPasswordVisible = false;
  password;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  getInputType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  initForm() {
    this.passwordForm = new FormGroup({
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      confirmPassword: new FormControl( null, {validators: [Validators.required, this.confirmPassword.bind(this)]})
    });
  }

  createUser() {
    console.log(this.passwordForm);
  }

  confirmPassword(password: FormControl): { [s: string]: boolean } {
      if (this.password !== password.value) {
        return {'passwordConfirm': true};
      }
    return null;
  }


}
