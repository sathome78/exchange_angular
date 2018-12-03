import { Component, OnInit } from '@angular/core';
import {BalanceCrypto} from '../model';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  public balanceTab: string;
  public cryptoBalances: BalanceCrypto[];

  constructor() { }

  ngOnInit() {
    this.setFields();
  }

  public setFields() {
    this.balanceTab = 'crypto-tab';
  }

  public toggleBalanceTab(tab: string) {
    this.balanceTab = tab;
  }

  public isShowBalanceTab(tab: string): boolean {
    // console.log('ggg')
    return this.balanceTab === tab;
  }

}
