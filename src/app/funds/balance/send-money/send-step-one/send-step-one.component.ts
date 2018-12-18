import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {INNER_TRANSFER, FIAT_WITHDRAWAL, CRYPTO_WITHDRAWAL} from '../send-money-constants';

@Component({
  selector: 'app-send-step-one',
  templateUrl: './send-step-one.component.html',
  styleUrls: ['./send-step-one.component.scss']
})
export class SendStepOneComponent implements OnInit {

  @Output() chooseSend = new EventEmitter();
  public INNER_TRANSFER = INNER_TRANSFER;
  public FIAT_WITHDRAWAL = FIAT_WITHDRAWAL;
  public CRYPTO_WITHDRAWAL = CRYPTO_WITHDRAWAL;

  constructor() {
  }

  ngOnInit() {
  }

  onChooseSend(name: string) {
    this.chooseSend.emit(name);
  }

}
