import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BalanceItem } from '../../../models/balance-item.model';
import { FIAT_DEPOSIT, CRYPTO_DEPOSIT, INNER_TRANSFER, FIAT_DEPOSIT_QUBERA } from '../../send-money/send-money-constants';

@Component({
  selector: 'app-refill-step-two',
  templateUrl: './refill-step-two.component.html',
  styleUrls: ['./refill-step-two.component.scss'],
})
export class RefillStepTwoComponent implements OnInit {

  @Input() choosedName: string;
  @Input() refillData: BalanceItem;
  @Output() closePopup = new EventEmitter();

  public FIAT_DEPOSIT = FIAT_DEPOSIT;
  public CRYPTO_DEPOSIT = CRYPTO_DEPOSIT;
  public INNER_TRANSFER = INNER_TRANSFER;
  public FIAT_DEPOSIT_QUBERA = FIAT_DEPOSIT_QUBERA;

  constructor() { }

  ngOnInit() {
  }

}
