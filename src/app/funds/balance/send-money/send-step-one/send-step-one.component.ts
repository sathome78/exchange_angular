import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {INNER_TRANSFER, FIAT_WITHDRAWAL, CRYPTO_WITHDRAWAL} from '../send-money-constants';
import {PopupService} from '../../../../shared/services/popup.service';

@Component({
  selector: 'app-send-step-one',
  templateUrl: './send-step-one.component.html',
  styleUrls: ['./send-step-one.component.scss']
})
export class SendStepOneComponent implements OnInit {

  @Output() chooseSend = new EventEmitter();
  @Output() closePopup = new EventEmitter();
  public INNER_TRANSFER = INNER_TRANSFER;
  public FIAT_WITHDRAWAL = FIAT_WITHDRAWAL;
  public CRYPTO_WITHDRAWAL = CRYPTO_WITHDRAWAL;

  constructor(
    private popupService: PopupService
  ) {
  }

  ngOnInit() {
  }

  onChooseSend(name: string) {
    this.popupService.demoPopupMessage = 1;
    this.popupService.showDemoTradingPopup(true);
    this.closePopup.emit();
    // this.chooseSend.emit(name);
  }

}
