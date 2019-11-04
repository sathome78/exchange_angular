import { Injectable, OnDestroy } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { Message } from '@stomp/stompjs';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { CurrencyPair } from '../model/currency-pair.model';
import * as dashboardActions from './actions/dashboard.actions';
import * as fromCore from '../core/reducers';
import { UserService } from '../shared/services/user.service';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';
import { TOKEN, EXRATES_REST_TOKEN } from 'app/shared/services/http.utils';
import { MainLoaderService } from 'app/shared/services/main-loader.service';

@Injectable()
export class DashboardWebSocketService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public currencyPairs: CurrencyPair[] = [];
  public sessionIdsubject = new Subject();
  public pairFromDashboard = '';
  public sessionId = null;
  public userEmail = null;

  constructor(
    private stompService: RxStompService,
    private userService: UserService,
    private utilsService: UtilsService,
    private mainLoaderService: MainLoaderService,
    private store: Store<fromCore.State>
  ) { }

  marketsSubscription(): any {
    return this.stompService
      .watch(`/app/statisticsNew`)
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(map(message => {
        this.mainLoaderService.provideLoader(this.mainLoaderService.const.marketsDB);
        return message;
      }));
  }

  pairInfoSubscription(pairName: string): any {
    return this.stompService
      .watch(`/app/statistics/pairInfo/${pairName}`)
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(map(message => {
        this.mainLoaderService.provideLoader(this.mainLoaderService.const.pairInfoDB);
        return message;
      }));
  }

  allTradesSubscription(pairName: string): any {
    return this.stompService
      .watch(`/app/all_trades/${pairName}`)
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(map(message => {
        this.mainLoaderService.provideLoader(this.mainLoaderService.const.tradesHistoryDB);
        return message;
      }));
  }

  orderBookSubscription(pairName: string, precision: number): any {
    return this.stompService
      .watch(`/app/order_book/${pairName}/${precision}`)
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(map(message => {
        this.mainLoaderService.provideLoader(this.mainLoaderService.const.ordersBookDB);
        return message;
      }));
  }

  openOrdersSubscription(pairName: string, publicId: string): any {
    const pn = pairName.toLowerCase().replace('/', '_');
    const headers = {
      [EXRATES_REST_TOKEN]: localStorage.getItem(TOKEN),
    };
    return this.stompService
      .watch(`/app/orders/open/${pn}/${publicId}`, headers)
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(map(message => {
        this.mainLoaderService.provideLoader(this.mainLoaderService.const.openOrdersDB);
        return message;
      }));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
