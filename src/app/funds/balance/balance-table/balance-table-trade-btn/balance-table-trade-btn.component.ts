import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DetailedCurrencyPair} from '../../../../model/detailed-currency-pair';
import {BalanceItem} from '../../../models/balance-item.model';
import {UtilsService} from '../../../../shared/services/utils.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-balance-table-trade-btn',
  templateUrl: './balance-table-trade-btn.component.html',
  styleUrls: ['./balance-table-trade-btn.component.scss']
})
export class BalanceTableTradeBtnComponent implements OnInit {

  @Input('allPairs') public allPairs: DetailedCurrencyPair[] = [];
  @Input('item') public item: BalanceItem;

  public redirectToPair = 'USD/BTC';
  public pairsCandidat = [];
  public isFiat: boolean;

  constructor(
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isFiat = this.utilsService.isFiat(this.item.currencyName);

    this.pairsCandidat = this.allPairs.filter(f => !f.hidden && f.name.split('/')[this.isFiat ? 1 : 0] === this.item.currencyName);
     this.searchCandidat();
  }

  searchCandidat(): void {
    if (!this.pairsCandidat.length) {
      this.redirectToPair = null;
      return;
    }
    if (!!this.searchByMarket('BTC').length) {
      this.redirectToPair = this.searchByMarket('BTC')[0].name;
      return;
    }
    if (!!this.searchByMarket('ETH').length) {
      this.redirectToPair = this.searchByMarket('ETH')[0].name;
      return;
    }
    if (!!this.searchByMarket('USD').length) {
      this.redirectToPair = this.searchByMarket('USD')[0].name;
      return;
    }
    this.redirectToPair = this.pairsCandidat[0].name;
  }

  searchByMarket(market: string): DetailedCurrencyPair[] {
    return this.pairsCandidat.filter(f => f.name.split('/')[this.isFiat ? 0 : 1] === market);
  }

  btnClick(): void {
    this.router.navigate([`/markets/${this.redirectToPair.replace('/', '-')}`]);
  }

}
