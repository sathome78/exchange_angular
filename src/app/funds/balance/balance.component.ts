import { Component, OnInit } from '@angular/core';
import {BalanceItem} from './balance-item.model';
import {BalanceService} from '../../shared/balance.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  balanceItems: BalanceItem [] = [];

  constructor(private balanceService: BalanceService) { }

  ngOnInit() {

    this.balanceService.getBalanceItems().subscribe(items => {
      this.balanceItems = items;
      console.log(this.balanceItems);
    });
  }

}
