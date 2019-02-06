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
import {CurrencyPairInfoService} from './components/currency-pair-info/currency-pair-info.service';
import {getCurrencyPair} from '../core/reducers';
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
      .pipe(select(getCurrencyPair))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(pair => {
        this.currentCurrencyPair = pair;
      });
  }

  setStompSubscription(authenticated: boolean): any {
    return this.stompSubscription = this.stompService
      .subscribe('/app/statisticsNew')
      .pipe(map((message: Message) => JSON.parse(JSON.parse(message.body))))
      .subscribe((items) => {
        // console.log(items);
        if (items) {
          // clean cached data
          this.currencyPairs = [];
        }
        this.processCurrencyPairs(items.data);
      });
  }

  setRabbitStompSubscription() {
    return this.stompService
      .subscribe('/topic/rabbit')
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .pipe(filter((message) => this.currentCurrencyPair && (message.currencyPairId === this.currentCurrencyPair.currencyPairId)))
      .pipe(map((message) => {
        console.log('updated');
        return message;
      }))
      .pipe(map(() => this.currentCurrencyPair));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  processCurrencyPairs(array: CurrencyPair[]) {
    if (this.authService.isAuthenticated()) {
      this.getUserFavouriteCurrencyPairIds()
        // .pipe(takeUntil(ngUnsubscribe))
        .subscribe(rs => {
          this.managePairs(array, rs);
        });
    } else {
      this.managePairs(array, []);
    }
  }

  getUserFavouriteCurrencyPairIds(): Observable<number[]> {
    const url = this.baseUrl + '/info/private/v2/settings/currency_pair/favourites';
    return this.http.get<number[]>(url);
  }

  /**
   * find pair by currency-pair-name and emit
   * @param {string} pairName
   * @param pair
   */
  findPairByCurrencyPairName(pairName: string): void {
    this.currencyPairs.forEach(elm => {
      if (pairName === elm.currencyPairName) {
        this.store.dispatch(new dashboardActions.ChangeCurrencyPairAction(elm));
        this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(elm.currencyPairId))
        this.userService.getUserBalance(elm);
      }
    });
  }

  choosePairForTrade(currency: string) {
    this.store
      .pipe(select(getCurrencyPairArray))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currencyPairs: CurrencyPair[]) => {
        const filteredPairs = currencyPairs.filter(pair => {
          const splitName = pair.currencyPairName.split('/');
          return splitName[0] === currency || splitName[1] === currency;
        })
        const filteredPair = filteredPairs.filter(pair => {
          const splitName = pair.currencyPairName.split('/');
          return splitName[0] === 'BTC' || splitName[1] === 'BTC';
        });
        const currentPair = filteredPair[0] ? filteredPair[0] : filteredPairs[0];
        this.store.dispatch(new dashboardActions.ChangeCurrencyPairAction(currentPair));
      });
  }

  managePairs(array: CurrencyPair[], ids: number[]) {
    this.trimZeroedAndRemainFavourite(array, ids);
    array.forEach(item => {
      this.addOrUpdate(item, ids);
    });
    this.store.dispatch(new dashboardActions.LoadCurrencyPairsAction(this.currencyPairs));
    if (this.currencyPairs.length > 0 && this.pairFromDashboard === '') {

      if (this.isNeedChangeCurretPair && this.currentCurrencyPair.currencyPairId === 0) {
        const activePair = this.getActiveCurrencyPair();
        this.store.dispatch(new dashboardActions.ChangeCurrencyPairAction(activePair));
        this.userService.getUserBalance(activePair);
        this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(activePair.currencyPairId))
      } else {
        this.store
          .pipe(select(getCurrencyPair))
          .subscribe((pair: CurrencyPair) => {
            this.userService.getUserBalance(pair);
            this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(pair.currencyPairId))
          });
      }

    }
    if (this.pairFromDashboard !== '') {
      this.currencyPairs.forEach(pair => {
        if (pair.currencyPairName === this.pairFromDashboard) {
          this.store.dispatch(new dashboardActions.ChangeCurrencyPairAction(pair));
          this.userService.getUserBalance(pair);
          this.store.dispatch(new dashboardActions.LoadCurrencyPairInfoAction(pair.currencyPairId))
        }
      });
    }
  }

  addOrUpdate(currencyPair: CurrencyPair, favouritePairsId: number[]) {
    let found = false;
    this.currencyPairs.forEach(item => {
      if (currencyPair.currencyPairId === item.currencyPairId) {
        found = true;
        item = CurrencyPair.fromJSON(currencyPair);
      }
    });
    if (!found) {
      this.currencyPairs.push(currencyPair);
    }
  }

  trimZeroedAndRemainFavourite(pairs: CurrencyPair[], ids: number[]) {
    pairs = pairs.filter(pair => this.isFavourite(pair, ids) || this.isNotZeroed(pair));
  }

  private isFavourite(pair: CurrencyPair, ids: number[]) {
    let found = false;
    ids.forEach(id => {
      if (id === pair.currencyPairId) {
        pair.isFavourite = true;
        found = true;
      }
    });
    return found;
  }

  /**
   * this method simply gets pairs from cache and when subscription is on we should drop data
   */
  makeItFast() {
    const url = this.baseUrl + '/info/public/v2/currencies/fast';
    this.http.get<CurrencyPair []>(url).subscribe(items => {
      this.processCurrencyPairs(items);
    });
  }

  private isNotZeroed(pair: CurrencyPair) {
    return pair.predLastOrderRate > 0
      && pair.lastOrderRate > 0
      && pair.volume > 0;
  }

  private getActiveCurrencyPair(): CurrencyPair {
    this.currencyPairs.forEach(pair => {
      if (pair.currencyPairId === 1) {
        // console.log(JSON.stringify(pair));
        return pair;
      }
    });
    return this.currencyPairs[0];
  }

}
