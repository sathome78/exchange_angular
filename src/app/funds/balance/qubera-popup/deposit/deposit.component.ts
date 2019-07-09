import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import {BalanceService} from '../../../services/balance.service';
import {select, Store} from '@ngrx/store';
import {State, getCryptoCurrenciesForChoose} from 'app/core/reducers';
import {BalanceItem} from '../../../models/balance-item.model';
import {RefillData} from '../../../../shared/interfaces/refill-data-interface';
import {RefreshAddress} from '../../../../shared/interfaces/refresh-address-interface';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})

export class DepositComponent implements OnInit {
  
  @Input() qubera;
  @Input() steper;
  step: number;
  
  ngOnInit() {
    this.setStep(this.steper);
  }

  setStep(steper: number) {
    this.step = steper;
  }

  onCloseSendMoneyPopup() {
    console.log('hi')
  }
}
