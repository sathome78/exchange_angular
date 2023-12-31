import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { UtilsService } from 'app/shared/services/utils.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {SimpleCurrencyPair} from '../../../../model/simple-currency-pair';

@Component({
  selector: 'app-embedded-orders-history',
  templateUrl: './embedded-orders-history.component.html',
  styleUrls: ['./embedded-orders-history.component.scss']
})
export class EmbeddedOrdersHistoryComponent implements OnInit, OnChanges {

  @Input() historyOrders;
  @Input() makeHeight;
  @Input() isVipUser: boolean = false;
  @Input() currentPair: SimpleCurrencyPair;
  public currentPage = 1;
  public countPerPage = 7;
  public arrPairName = ['', ''];

  constructor(
    private utils: UtilsService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.arrPairName = this.currentPair.name.split('/');
  }

  filterOpenOrders(page) {
    this.currentPage = page;
    // const filteredOrders = this.data.filter(order => order.status !== 'OPENED');
    // this.showOrders = filteredOrders;
  }

  /**
   * Change count items when we make height bigger
   *
   * @param changes
   */
  ngOnChanges(changes): void {
    if (!changes.makeHeight) { return; }
    // change count orders perPage
    this.countPerPage = changes.makeHeight.currentValue === true ? 7 : 18;
  }

  currency(currName: string, currIndex: number): string {
    const curr = currName.split('/');
    return curr[currIndex - 1];
  }


}
