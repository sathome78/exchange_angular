import {Injectable} from '@angular/core';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from '../model/currency-pair.model';
import {map} from 'rxjs/internal/operators';
import {Message} from '@stomp/stompjs';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {State} from './reducers/dashboard.reducer';
import {ChangeCurrencyPairAction, LoadCurrencyPairsAction} from './actions/dashboard.actions';
import {UserService} from '../services/user.service';


@Injectable()
export class DashboardWebSocketService {

  currencyPairs: CurrencyPair [] = [];
  private stompSubscription: any;
  private baseUrl = environment.apiUrl;

  constructor(
    private stompService: StompService,
    private http: HttpClient,
    private userService: UserService,
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

  private processCurrencyPairs(array: CurrencyPair[], authenticated: boolean) {
    if (authenticated) {
      this.getUserFavouriteCurrencyPairIds().subscribe(rs => {
        this.managePairs(array, rs);
      });
    } else {
      this.managePairs(array, []);
    }
    // console.log(array);
  }

  getUserFavouriteCurrencyPairIds(): Observable<number[]> {
    const url = this.baseUrl + '/info/private/v2/settings/currency_pair/favourites';
    return this.http.get<number[]>(url);
  }

  managePairs(array: CurrencyPair[], ids: number[]) {
    this.trimZeroedAndRemainFavourite(array, ids);
    array.forEach(item => {
      this.addOrUpdate(item, ids);
    });
    this.store.dispatch(new LoadCurrencyPairsAction(this.currencyPairs));
    if (this.currencyPairs.length > 0) {
      this.store.dispatch(new ChangeCurrencyPairAction(this.getActiveCurrencyPair()));
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
