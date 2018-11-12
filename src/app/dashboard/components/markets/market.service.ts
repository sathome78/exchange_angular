import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from './currency-pair.model';
import {Message} from '@stomp/stompjs';
import {map, tap} from 'rxjs/internal/operators';
import {Observable, ReplaySubject} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserBalance} from '../../model/user.model';


@Injectable()
export class MarketService {

  currencyPairs: CurrencyPair [] = [];
  marketListener$: Subject<CurrencyPair[]>;
  userBalanceListener$: ReplaySubject<UserBalance>;
  activeCurrencyListener: ReplaySubject<CurrencyPair>;
  public currentCurrencyInfoListener$: ReplaySubject<any>;
  currencyPairsInfo$ = new BehaviorSubject({balanceByCurrency1: 30000, rate: 1.227});
  private baseUrl = environment.apiUrl;

  private stompSubscription: any;

  constructor(
    private stompService: StompService,
    private http: HttpClient,
  ) {
    this.currentCurrencyInfoListener$ = new ReplaySubject<any>();
    this.marketListener$ = new Subject<CurrencyPair[]>();
    this.activeCurrencyListener = new ReplaySubject<CurrencyPair>();
    this.userBalanceListener$ = new ReplaySubject<UserBalance>();
  }

  setStompSubscription(authenticated: boolean): any {
    return this.stompSubscription = this.stompService
      .subscribe('/app/statisticsNew')
      .pipe( map((message: Message) => JSON.parse(JSON.parse(message.body))))
      .subscribe((items) => {
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

  managePairs(array: CurrencyPair[], ids: number[]) {
    this.trimZeroedAndRemainFavourite(array, ids);
    array.forEach(item => {
      this.addOrUpdate(item, ids);
    });
    this.marketListener$.next(this.currencyPairs);
    if (this.currencyPairs.length > 0) {
      // this.activeCurrencyListener.next(this.currencyPairs[0]);
      this.activeCurrencyListener.next(this.getActiveCurrencyPair());
    }
  }

  unsubscribe() {
    this.stompSubscription.unsubscribe();
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

  /**
   * find pair by currency-pair-name and emit  ((( delete pair argument when data will come from server)))
   * @param {string} pairName
   * @param pair
   */
  findPairByCurrencyPairName(pairName: string, pair): void {
    /** for mock data */
    // pair.currencyPairName = pairName;
    // this.activeCurrencyListener.next(pair);
    /** ---------------- */
    this.currencyPairs.forEach(elm => {
      if (pairName === elm.currencyPairName) {
        this.activeCurrencyListener.next(elm);
      }
    });
  }

  /**
   * check pair and emit
   * @param {CurrencyPair} pair
   */
  setActiveCurrency(pair: CurrencyPair): void {
    /** for mock data */
    this.activeCurrencyListener.next(pair);
    /** ---------------- */
    /*this.currencyPairs.forEach(elm => {
      if (pair.currencyPairId === elm.currencyPairId) {
        this.activeCurrencyListener.next(elm);
      }
    });*/
  }

  findPairByID(id) {
    this.currencyPairs.forEach( elm => {
      if (elm.currencyPairId === id) {
        return elm;
      }
    });
  }

  getUserFavouriteCurrencyPairIds(): Observable<number[]> {
    const url = this.baseUrl + '/info/private/v2/settings/currency_pair/favourites';
    return this.http.get<number[]>(url);
  }

  manageUserFavouriteCurrencyPair(cp: CurrencyPair): Observable<number> {
    const data: {'PAIR_ID': string, 'TO_DELETE': string} = {'PAIR_ID': cp.currencyPairId + '', 'TO_DELETE': !cp.isFavourite + ''};
    const url = this.baseUrl + '/info/private/v2/settings/currency_pair/favourites';
    return this.http.put<number>(url, data);
  }

  currencyPairInfo(pairId): Observable<any> {
    return this.http.get(`${this.baseUrl}/info/public/v2/info/${pairId}`)
      .pipe(tap(info => this.currencyPairsInfo$.next(info)));
  }

  userBalanceInfo(pairId): Observable<any> {
    return this.http.get(`${this.baseUrl}/info/private/v2/dashboard/info/${pairId}`)
      .pipe(tap(info => this.userBalanceListener$.next(info)));
  }

  private getActiveCurrencyPair(): CurrencyPair {
    this.currencyPairs.forEach(pair => {
      if (pair.currencyPairId === 1) {
        // console.log(JSON.stringify(pair));
        return pair;
      }
    });
    console.log('getActiveCurrencyPair', this.currencyPairInfo[0]);
    return this.currencyPairs[0];
  }
}
