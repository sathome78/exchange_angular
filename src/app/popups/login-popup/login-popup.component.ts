import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {PopupService} from '../../services/popup.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {

  constructor(private popupService: PopupService) { }

  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl()
    });
  }

  closeMe() {
    this.popupService.closeLoginPopup();
  }
}
