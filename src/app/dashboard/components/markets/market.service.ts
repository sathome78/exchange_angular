import {Injectable} from '@angular/core';
import {StompService} from '@stomp/ng2-stompjs';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject, Subject, BehaviorSubject} from 'rxjs';
import {tap, takeUntil} from 'rxjs/internal/operators';

import {environment} from 'environments/environment';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {DashboardWebSocketService} from '../../dashboard-websocket.service';
import {AuthService} from 'app/shared/services/auth.service';


@Injectable()
export class MarketService {

  currencyPairs: CurrencyPair [] = [];
  marketListener$: Subject<CurrencyPair[]>;
  // userBalanceListener$: ReplaySubject<UserBalance>;
  activeCurrencyListener: ReplaySubject<CurrencyPair>;
  public currentCurrencyInfoListener$: ReplaySubject<any>;
  currencyPairsInfo$ = new BehaviorSubject({balanceByCurrency1: 30000, rate: 1.227});
  private baseUrl = environment.apiUrl;

  private stompSubscription: any;

  constructor(
    private stompService: StompService,
    private dashboardWebsocketService: DashboardWebSocketService,
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.currentCurrencyInfoListener$ = new ReplaySubject<any>();
    this.marketListener$ = new Subject<CurrencyPair[]>();
    this.activeCurrencyListener = new ReplaySubject<CurrencyPair>();
    // this.userBalanceListener$ = new ReplaySubject<UserBalance>();
  }

  /**
   * this method simply gets pairs from cache and when subscription is on we should drop data
   */
  makeItFast(ngUnsubscribe) {
    const url = this.baseUrl + '/api/public/v2/currencies/fast';
    this.http.get<CurrencyPair []>(url)
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe(items => {
        this.dashboardWebsocketService.processCurrencyPairs(items);
      });
  }

  removeFavourites() {
    const url = this.baseUrl + '/api/private/v2/settings/currency_pair/favourites';
    return this.http.delete<number>(url);
  }

  unsubscribe() {
  }

  manageUserFavouriteCurrencyPair(cp: CurrencyPair): Observable<number> {
    const data: {'PAIR_ID': string, 'TO_DELETE': string} = {'PAIR_ID': cp.currencyPairId + '', 'TO_DELETE': !cp.isFavourite + ''};
    const url = this.baseUrl + '/api/private/v2/settings/currency_pair/favourites';
    return this.http.put<number>(url, data);
  }

  currencyPairInfo(pairId): Observable<any> {
      return this.http.get(`${this.baseUrl}/api/public/v2/info/${pairId}`)
        .pipe(tap(info => this.currencyPairsInfo$.next(info)));
  }

  // userBalanceInfo(pairId): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/api/private/v2/dashboard/info/${pairId}`)
  //     .pipe(tap(info => this.userBalanceListener$.next(info)));
  // }

}
