import {Component, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {Subscription} from 'rxjs';
import {v} from '@angular/core/src/render3';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.css']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  constructor(private popupService: PopupService) {
  }

  ngOnInit() {
  }

  updateAuthProviderSettings(value: string) {
    console.log(value);
    this.popupService.showTFAPopup(value);
  }

}
