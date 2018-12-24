import {Component, Input, OnInit} from '@angular/core';
import {PopupService} from '../../shared/services/popup.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-already-registered-popup',
  templateUrl: './already-registered-popup.component.html',
  styleUrls: ['./already-registered-popup.component.scss']
})
export class AlreadyRegisteredPopupComponent implements OnInit {

  @Input() message;
  public showHtml;
  public buttonText = 'Ok';

  private defaultMessage = `<p>You have already used the link to confirm your registration. If necessary, please repeat the registration process.</p>`;

  constructor(
    private popupService: PopupService,
  ) {}

  ngOnInit() {
    this.showHtml = this.defaultMessage;
  }

  buttonClick() {
    this.closeMe();
  }

  closeMe() {
    this.popupService.toggleAlreadyRegisteredPopup(false);
  }

}
