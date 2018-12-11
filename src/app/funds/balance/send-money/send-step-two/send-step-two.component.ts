import {Component, Input, OnInit} from '@angular/core';
import {FIAT_WITHDRAWAL, CRYPTO_WITHDRAWAL, INNER_TRANSFER} from '../send-money-constants';

@Component({
  selector: 'app-send-step-two',
  templateUrl: './send-step-two.component.html',
  styleUrls: ['./send-step-two.component.scss']
})
export class SendStepTwoComponent implements OnInit {

  @Input() choosedName: string;
  public CRYPTO_WITHDRAWAL = CRYPTO_WITHDRAWAL;
  public FIAT_WITHDRAWAL = FIAT_WITHDRAWAL;
  public INNER_TRANSFER = INNER_TRANSFER;

  constructor() { }

  ngOnInit() {
  }

}
