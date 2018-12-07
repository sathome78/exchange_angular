import { Component, OnInit } from '@angular/core';
import {MockDataService} from '../../../shared/services/mock-data.service';

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
