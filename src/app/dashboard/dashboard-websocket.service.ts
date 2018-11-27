import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs/internal/operators';
import {Message} from '@stomp/stompjs';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from '../model/currency-pair.model';
import {environment} from '../../environments/environment';
import {State} from './reducers/dashboard.reducer';
import {ChangeCurrencyPairAction, LoadCurrencyPairsAction} from './actions/dashboard.actions';
import {UserService} from '../services/user.service';
import {CurrencyPairInfoService} from './components/currency-pair-info/currency-pair-info.service';


@Injectable()
export class DashboardWebSocketService {

  currencyPairs: CurrencyPair [] = [];
  private stompSubscription: any;
  private baseUrl = environment.apiUrl;
  public pairFromDashboard = '';

  constructor(
    private stompService: StompService,
    private http: HttpClient,
    private userService: UserService,
    private currencyPairInfoService: CurrencyPairInfoService,
    private store: Store<State>
  ) {}

  setStompSubscription(authenticated: boolean): any {
    return this.stompSubscription = this.stompService
      .subscribe('/app/statisticsNew')
      .pipe( map((message: Message) => JSON.parse(JSON.parse(message.body))))
      .subscribe((items) => {
        console.log(items);
        if (items) {
          // clean cached data
          this.currencyPairs = [];
        }
        this.processCurrencyPairs(items.data, authenticated);
      });
  }

   processCurrencyPairs(array: CurrencyPair[], authenticated: boolean) {
    if (authenticated) {
      this.getUserFavouriteCurrencyPairIds().subscribe(rs => {
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
        this.store.dispatch(new ChangeCurrencyPairAction(elm));
        this.userService.getUserBalance(elm);
      }
    });
  }

  managePairs(array: CurrencyPair[], ids: number[]) {
    this.trimZeroedAndRemainFavourite(array, ids);
    array.forEach(item => {
      this.addOrUpdate(item, ids);
    });
    this.store.dispatch(new LoadCurrencyPairsAction(this.currencyPairs));
    if (this.currencyPairs.length > 0 && this.pairFromDashboard === '') {
      const activePair = this.getActiveCurrencyPair();
      this.store.dispatch(new ChangeCurrencyPairAction(activePair));
      this.userService.getUserBalance(activePair);
      this.currencyPairInfoService.getCurrencyPairInfo(activePair);
    }
    if (this.pairFromDashboard !== '') {
      this.currencyPairs.forEach(pair => {
        if (pair.currencyPairName === this.pairFromDashboard) {
          this.store.dispatch(new ChangeCurrencyPairAction(pair));
          this.userService.getUserBalance(pair);
          this.currencyPairInfoService.getCurrencyPairInfo(pair);
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
    pairs = pairs.filter(pair =>  this.isFavourite(pair, ids) || this.isNotZeroed(pair));
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
      this.processCurrencyPairs(items, false);
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
