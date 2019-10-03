import { Injectable, OnDestroy } from '@angular/core';

import { map, takeUntil, withLatestFrom, subscribeOn, switchMap, mergeMap, filter } from 'rxjs/internal/operators';
import { Message } from '@stomp/stompjs';
import { Store, select } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { CurrencyPair } from '../model/currency-pair.model';
import * as dashboardActions from './actions/dashboard.actions';
import * as fromCore from '../core/reducers';
import { UserService } from '../shared/services/user.service';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';
import { TOKEN, EXRATES_REST_TOKEN } from 'app/shared/services/http.utils';

@Injectable()
export class DashboardWebSocketService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public currencyPairs: CurrencyPair[] = [];
  private openOrdersSub$: Subscription;
  public sessionIdsubject = new Subject();
  public pairFromDashboard = '';
  public sessionId = null;
  public userEmail = null;

  constructor(
    private stompService: RxStompService,
    private userService: UserService,
    private utilsService: UtilsService,
    private store: Store<fromCore.State>
  ) {
    this.store
      .pipe(select(fromCore.getIsAuthenticated))
      .pipe(withLatestFrom(this.store.pipe(select(fromCore.getUserInfo))))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([isAuth, userInfo]: [boolean, ParsedToken]) => {
        if (isAuth && userInfo) {
          this.userEmail = userInfo.username;
          this.getSessionId();
        } else {
          this.unregister();
        }
      });

  }

  private getSessionId() {
    this.stompService.connected$.subscribe(() => {
      const socket: any = this.stompService.stompClient.webSocket;
      const urlarray = socket._transport.url.split('/');
      const index = urlarray.length - 2;
      this.sessionId = urlarray[index];
      this.register();
      this.sessionIdsubject.next(this.sessionId);
    });
  }

  private register() {
    const message = { email: this.userEmail, sessionId: this.sessionId };
    this.stompService.publish({ destination: '/app/register', body: JSON.stringify(message) });
  }

  private unregister() {
    const message = { email: this.userEmail, sessionId: this.sessionId };
    this.stompService.publish({ destination: '/app/unregister', body: JSON.stringify(message) });
  }

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
    this.openOrdersSub$ =
      this.sessionIdsubject
        .pipe(filter(id => !!id))
        .pipe(mergeMap(() => this.openOrdersSubscription(pairName)))
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: any) => {
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
    this.unregister();
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
