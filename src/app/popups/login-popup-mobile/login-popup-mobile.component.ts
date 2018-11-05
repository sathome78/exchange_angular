import { Component, OnInit } from '@angular/core';
import {PopupService} from '../../services/popup.service';

@Component({
  selector: 'app-login-popup-mobile',
  templateUrl: './login-popup-mobile.component.html',
  styleUrls: ['./login-popup-mobile.component.scss']
})
export class LoginPopupMobileComponent implements OnInit {

  constructor(
    private popupService: PopupService,
  ) { }

  ngOnInit() {
  }

  closeMe() {
    this.popupService.closeMobileLoginPopup();
  }

  openRegistration() {
    this.popupService.showMobileRegistrationPopup(true);
    this.closeMe();
  }

}
