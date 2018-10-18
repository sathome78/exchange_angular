import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {StompService} from '@stomp/ng2-stompjs';
import {CurrencyPair} from './currency-pair.model';
import {Message} from '@stomp/stompjs';
import {map} from 'rxjs/internal/operators';


@Injectable()
export class MarketService {

  currencyPairs: CurrencyPair [] = [];
  marketListener: Subject<CurrencyPair[]>;
  activeCurrencyListener: Subject<CurrencyPair>;

  private stompSubscription: any;

  constructor(
    private stompService: StompService,
  ) {
    this.marketListener = new Subject<CurrencyPair[]>();
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
    this.marketListener.next(this.currencyPairs);
    if (this.currencyPairs.length > 0) {
      this.activeCurrencyListener.next(this.currencyPairs[0]);
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

  setActiveCurrency(pair: CurrencyPair) {
    // this.currencyPairs.forEach(elm => {
    //   if (pair.pairId === elm.pairId) {
    //     this.activeCurrencyListener.next(elm);
    //   }
    // });
    /** for mock data */
    this.activeCurrencyListener.next(pair);
    /** ---------------- */
  }

}
