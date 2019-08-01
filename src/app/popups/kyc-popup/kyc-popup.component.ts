import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Animations } from '../../shared/animations';
import { PopupService } from '../../shared/services/popup.service';
import { select, Store } from '@ngrx/store';
import { getVerificationStatus, State } from '../../core/reducers';

@Component({
  selector: 'app-kyc-popup',
  templateUrl: './kyc-popup.component.html',
  styleUrls: ['./kyc-popup.component.scss'],
  animations: [Animations.popupOverlayTrigger, Animations.popupModalTrigger],
})
export class KycPopupComponent implements OnInit {
  @Input() showPopup;
  @Input() step = 1;
  @Input() iframeUrl = '';

  public status$;

  constructor(private popupService: PopupService, private store: Store<State>) {
    this.status$ = this.store.pipe(select(getVerificationStatus));
  }

  ngOnInit() {}

  closeMe() {
    this.popupService.closeKYCPopup();
  }

  goToSecondStep(event) {
    this.iframeUrl = event;
    this.step = 2;
  }
}
