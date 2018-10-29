import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from './currency-pair.model';
import {Message} from '@stomp/stompjs';
import {map, tap} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Injectable()
export class MarketService {

  currencyPairs: CurrencyPair [] = [];
  marketListener$: Subject<CurrencyPair[]>;
  activeCurrencyListener: Subject<CurrencyPair>;
  currencyPairsInfo$ = new BehaviorSubject({});
  private baseUrl = environment.apiUrl;

  private stompSubscription: any;

  constructor(
    private stompService: StompService,
    private http: HttpClient,
  ) {
    this.marketListener$ = new Subject<CurrencyPair[]>();
    this.activeCurrencyListener = new Subject<CurrencyPair>();
  }

  setStompSubscription(): any {
    return this.stompSubscription = this.stompService
      .subscribe('/app/statisticsNew')
      .pipe( map((message: Message) => JSON.parse(JSON.parse(message.body))))
      .subscribe((items) => {
        this.processCurrencyPairs(items.data);
      });
  }

  private processCurrencyPairs(array: CurrencyPair[]) {
    for (let i = 0; i < array.length; i++) {
      this.addOrUpdate(array[i]);
    }
    this.marketListener$.next(this.currencyPairs);
    if (this.currencyPairs.length > 0) {
      // this.activeCurrencyListener.next(this.currencyPairs[0]);
      this.activeCurrencyListener.next(this.getActiveCurrencyPair());
    }
    // console.log(array);
  }

  unsubscribe() {
    this.stompSubscription.unsubscribe();
  }

  addOrUpdate(currencyPair: CurrencyPair) {
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

  /**
   * find pair by currency-pair-name and emit  ((( delete pair argument when data will come from server)))
   * @param {string} pairName
   * @param pair
   */
  findPairByCurrencyPairName(pairName: string, pair): void {
    /** for mock data */
    pair.currencyPairName = pairName;
    this.activeCurrencyListener.next(pair);
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
    this.currencyPairs.forEach(elm => {
      if (pair.currencyPairId === elm.currencyPairId) {
        this.activeCurrencyListener.next(elm);
      }
    });
  }

  findPairByID(id) {
    this.currencyPairs.forEach( elm => {
      if (elm.currencyPairId === id) {
        return elm;
      }
    });
  }

  currencyPairInfo(pairId): Observable<any> {
    return this.http.get(`${this.baseUrl}/info/private/v2/dashboard/info/${pairId}`)
      .pipe(tap(info => this.currencyPairsInfo$.next(info)));
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
