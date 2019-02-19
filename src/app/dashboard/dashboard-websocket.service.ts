import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map, takeUntil, every, filter, tap} from 'rxjs/internal/operators';
import {Message} from '@stomp/stompjs';
import {select, Store} from '@ngrx/store';
import {Observable, Subject, iif} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from '../model/currency-pair.model';
import {environment} from '../../environments/environment';
import {getCurrencyPairArray, State} from '../core/reducers';
import * as dashboardActions from './actions/dashboard.actions';
import {UserService} from '../shared/services/user.service';
import {getActiveCurrencyPair} from '../core/reducers';
import {AuthService} from 'app/shared/services/auth.service';


@Injectable()
export class DashboardWebSocketService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  currencyPairs: CurrencyPair [] = [];
  private stompSubscription: any;
  private baseUrl = environment.apiUrl;
  public pairFromDashboard = '';
  public isNeedChangeCurretPair = true;
  private currentCurrencyPair;

  constructor(
    private stompService: StompService,
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService,
    private store: Store<State>
  ) {
    this.store
      .pipe(select(getActiveCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(pair => {
        this.currentCurrencyPair = pair;
      });
  }

  setStompSubscription(): any {
    return this.stompSubscription = this.stompService
      .subscribe('/app/statisticsNew')
      .pipe(map((message: Message) => JSON.parse(JSON.parse(message.body))))
      .subscribe((items) => {
        // console.log(items);
        if (items) {
          // clean cached data
          this.currencyPairs = [];
        }
        // this.processCurrencyPairs(items.data);
      });
  }

  // setRabbitStompSubscription() {
  //   return this.stompService
  //     .subscribe('/topic/rabbit')
  //     .pipe(map((message: Message) => JSON.parse(message.body)))
  //     .pipe(filter((message) => this.currentCurrencyPair && (message.currencyPairId === this.currentCurrencyPair.currencyPairId)))
  //     .pipe(map((message) => {
  //       console.log('updated');
  //       return message;
  //     }))
  //     .pipe(map(() => this.currentCurrencyPair));
  // }

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
        this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(elm));
        this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(elm.currencyPairId))
        this.userService.getUserBalance(elm);
      }
    });
  }
  // To refactor
  choosePairForTrade(currency: string) {
    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currencyPairs: CurrencyPair[]) => {
        const filteredPairs = currencyPairs.filter(pair => {
          const splitName = pair.currencyPairName.split('/');
          return splitName[0] === currency || splitName[1] === currency;
        });
        const filteredPair = filteredPairs.filter(pair => {
          const splitName = pair.currencyPairName.split('/');
          return splitName[0] === 'BTC' || splitName[1] === 'BTC';
        });
        const currentPair = filteredPair[0] ? filteredPair[0] : filteredPairs[0];
        this.store.dispatch(new dashboardActions.ChangeActiveCurrencyPairAction(currentPair));
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
