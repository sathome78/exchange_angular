import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-api-key-popup',
  templateUrl: './api-key-popup.component.html',
  styleUrls: ['./api-key-popup.component.scss']
})
export class ApiKeyPopupComponent implements OnInit {

  public twoFaAuthModeMessage = '';
  @Output() close2FAPopup = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
