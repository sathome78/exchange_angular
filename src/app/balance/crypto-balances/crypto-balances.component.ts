import { Component, OnInit } from '@angular/core';
import {BalanceService} from '../balance.service';
import {MockDataService} from '../../services/mock-data.service';

@Component({
  selector: 'app-crypto-balances',
  templateUrl: './crypto-balances.component.html',
  styleUrls: ['./crypto-balances.component.scss']
})
export class CryptoBalancesComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

}
