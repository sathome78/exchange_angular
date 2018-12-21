import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CRYPTO_DEPOSIT, FIAT_DEPOSIT, INNER_TRANSFER} from '../../send-money/send-money-constants';

@Component({
  selector: 'app-refill-step-one',
  templateUrl: './refill-step-one.component.html',
  styleUrls: ['./refill-step-one.component.scss']
})
export class RefillStepOneComponent implements OnInit {

  @Output() chooseRefill = new EventEmitter();
  public CRYPTO_DEPOSIT = CRYPTO_DEPOSIT;
  public FIAT_DEPOSIT = FIAT_DEPOSIT;
  public INNER_TRANSFER = INNER_TRANSFER;

  constructor() { }

  ngOnInit() {
  }

  onChooseRefill(name: string) {
    this.chooseRefill.emit(name);
  }

}
