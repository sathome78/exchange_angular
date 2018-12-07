import {Component, OnInit} from '@angular/core';
import {BalanceItem} from '../models/balance-item.model';
import {FundsService} from '../funds.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  /** */
  public Tab = {
    CRYPTO: 'CRYPTO',
    FIAT: 'FIAT',
    PR: 'PR',
  }

  public balanceItems: BalanceItem [] = [];
  public currTab: string = this.Tab.CRYPTO;

  constructor(private balanceService: FundsService) { }

  ngOnInit() {

  }

  public onSelectTab(tab: string): void {
    this.currTab = tab;
  }
 
}
