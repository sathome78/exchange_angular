import {Component, Input, OnInit} from '@angular/core';
import {BalanceItem} from '../../../models/balance-item.model';
import {FIAT_DEPOSIT, CRYPTO_DEPOSIT, INNER_TRANSFER} from '../../send-money/send-money-constants';

@Component({
  selector: 'app-refill-step-two',
  templateUrl: './refill-step-two.component.html',
  styleUrls: ['./refill-step-two.component.scss']
})
export class RefillStepTwoComponent implements OnInit {

  @Input() choosedName: string;
  @Input() refillData: BalanceItem;

  public FIAT_DEPOSIT = FIAT_DEPOSIT;
  public CRYPTO_DEPOSIT = CRYPTO_DEPOSIT;
  public INNER_TRANSFER = INNER_TRANSFER;

  constructor() { }

  ngOnInit() {
  }

}
