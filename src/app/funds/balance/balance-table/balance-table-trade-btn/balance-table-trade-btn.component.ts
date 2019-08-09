import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DetailedCurrencyPair } from '../../../../model/detailed-currency-pair';
import { BalanceItem } from '../../../models/balance-item.model';
import { UtilsService } from '../../../../shared/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balance-table-trade-btn',
  templateUrl: './balance-table-trade-btn.component.html',
  styleUrls: ['./balance-table-trade-btn.component.scss'],
})
export class BalanceTableTradeBtnComponent implements OnInit {
  @Input('allPairs') public allPairs: DetailedCurrencyPair[] = [];
  @Input('item') public item: BalanceItem;

  public redirectToPair = 'USD/BTC';
  public pairsCandidat = [];
  public isFiat: boolean;

  constructor(private utilsService: UtilsService, private router: Router) {}

  ngOnInit() {
    this.pairsCandidat = this.allPairs.filter(f => {
      return (!f.hidden && f.name.split('/')[0] === this.item.currencyName) || f.name.split('/')[1] === this.item.currencyName;
    });
    this.searchCandidat();
  }

  searchCandidat(): void {
    if (!this.pairsCandidat.length) {
      this.redirectToPair = null;
      return;
    }
    const btc = this.searchByMarket('BTC');
    if (!!btc.length) {
      this.redirectToPair = btc[0].name;
      return;
    }
    const eth = this.searchByMarket('ETH');
    if (!!eth.length) {
      this.redirectToPair = eth[0].name;
      return;
    }
    const usd = this.searchByMarket('USD');
    if (!!usd.length) {
      this.redirectToPair = usd[0].name;
      return;
    }
    this.redirectToPair = this.pairsCandidat[0].name;
  }

  searchByMarket(market: string): DetailedCurrencyPair[] {
    return this.pairsCandidat.filter(f => {
      return (!f.hidden && f.name.split('/')[0] === market) || f.name.split('/')[1] === market;
    });
  }

  btnClick(): void {
    this.router.navigate([`/markets/${this.redirectToPair.replace('/', '-')}`]);
  }
}
