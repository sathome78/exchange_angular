import { Injectable, OnDestroy } from '@angular/core';

import { map, takeUntil } from 'rxjs/internal/operators';
import { Message } from '@stomp/stompjs';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { CurrencyPair } from '../model/currency-pair.model';
import { State } from '../core/reducers';
import * as dashboardActions from './actions/dashboard.actions';
import { UserService } from '../shared/services/user.service';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';
import { TOKEN, EXRATES_REST_TOKEN } from 'app/shared/services/http.utils';

@Injectable()
export class DashboardWebSocketService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public currencyPairs: CurrencyPair[] = [];
  private openOrdersSub$: Subscription;
  public pairFromDashboard = '';

  constructor(
    private stompService: RxStompService,
    private userService: UserService,
    private utilsService: UtilsService,
    private store: Store<State>
  ) {}

  marketsSubscription(): any {
    return this.stompService.watch(`/app/statisticsNew`).pipe(map((message: Message) => JSON.parse(message.body)));
  }

  pairInfoSubscription(pairName: string): any {
    return this.stompService
      .watch(`/app/statistics/pairInfo/${pairName}`)
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  allTradesSubscription(pairName: string): any {
    return this.stompService
      .watch(`/app/all_trades/${pairName}`)
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  orderBookSubscription(pairName: string, precision: number): any {
    return this.stompService
      .watch(`/app/order_book/${pairName}/${precision}`)
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  openOrdersSubscription(pairName: string): any {
    const pn = pairName.toLowerCase().replace('/', '_');
    const headers = {
      [EXRATES_REST_TOKEN]: localStorage.getItem(TOKEN),
    };
    return this.stompService
      .watch(`/user/queue/open_orders/${pn}`, headers)
      .pipe(map((message: Message) => JSON.parse(message.body)));
  }

  loadOpenOrdersDashboard(pairName) {
    this.unsubscribeOpenOrders();
    this.openOrdersSub$ = this.openOrdersSubscription(pairName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.store.dispatch(new dashboardActions.SetOpenOrdersAction({
          openOrders: data,
          count: data.length,
        }));
      });
  }

  unsubscribeOpenOrders() {
    if (this.openOrdersSub$) {
      this.openOrdersSub$.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.unsubscribeOpenOrders();
  }

  /**
   * find pair by currency-pair-name and emit
   * @param {string} pairName
   * @param pair
   */

  // TODO remove after refactoring
  findPairByCurrencyPairName(pairName: string): void {
    this.currencyPairs.forEach(elm => {
      if (pairName === elm.currencyPairName) {
        const newActivePair = new SimpleCurrencyPair(elm.currencyPairId, elm.currencyPairName);
        this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(newActivePair));
        this.utilsService.saveActiveCurrencyPairToSS(newActivePair);
        this.userService.getUserBalance(newActivePair);
      }
    });
  }
}
