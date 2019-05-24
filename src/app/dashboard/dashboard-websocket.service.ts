import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, takeUntil } from 'rxjs/internal/operators';
import { Message } from '@stomp/stompjs';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { CurrencyPair } from '../model/currency-pair.model';
import { environment } from '../../environments/environment';
import { getCurrencyPairArray, State } from '../core/reducers';
import * as dashboardActions from './actions/dashboard.actions';
import { UserService } from '../shared/services/user.service';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';
import { UtilsService } from 'app/shared/services/utils.service';

@Injectable()
export class DashboardWebSocketService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  currencyPairs: CurrencyPair [] = [];
  private stompSubscription: any;
  private baseUrl = environment.apiUrl;
  public pairFromDashboard = '';
  public isNeedChangeCurretPair = true;

  constructor(
    private stompService: RxStompService,
    private userService: UserService,
    private utilsService: UtilsService,
    private store: Store<State>,
  ) { }

  marketsSubscription(): any {
    return this.stompService
      .watch('/app/statisticsNew')
      .pipe(map((message: Message) => JSON.parse(message.body)));
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

//  processCurrencyPairs (array: CurrencyPair[]) {
//     if (this.authService.isAuthenticated()) {
//       this.getUserFavouriteCurrencyPairIds()
//         // .pipe(takeUntil(ngUnsubscribe))
//         .subscribe(rs => {
//           this.managePairs(array, rs);
//         });
//     } else {
//       this.managePairs(array, []);
//     }
//   }

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

  // addOrUpdate(currencyPair: CurrencyPair, favouritePairsId: number[]) {
  //   let found = false;
  //   this.currencyPairs.forEach(item => {
  //     if (currencyPair.currencyPairId === item.currencyPairId) {
  //       found = true;
  //       item = CurrencyPair.fromJSON(currencyPair);
  //     }
  //   });
  //   if (!found) {
  //     this.currencyPairs.push(currencyPair);
  //   }
  // }

  // trimZeroedAndRemainFavourite(pairs: CurrencyPair[], ids: number[]) {
  //   pairs = pairs.filter(pair => this.isFavourite(pair, ids) || this.isNotZeroed(pair));
  // }

  // private isFavourite(pair: CurrencyPair, ids: number[]) {
  //   let found = false;
  //   ids.forEach(id => {
  //     if (id === pair.currencyPairId) {
  //       pair.isFavourite = true;
  //       found = true;
  //     }
  //   });
  //   return found;
  // }

  /**
   * this method simply gets pairs from cache and when subscription is on we should drop data
   */
  // makeItFast() {
  //   const url = this.baseUrl + '/api/public/v2/currencies/fast';
  //   this.http.get<CurrencyPair []>(url).subscribe(items => {
  //     this.processCurrencyPairs(items);
  //   });
  // }

  // private isNotZeroed(pair: CurrencyPair) {
  //   return pair.predLastOrderRate > 0
  //     && pair.lastOrderRate > 0
  //     && pair.volume > 0;
  // }

}
