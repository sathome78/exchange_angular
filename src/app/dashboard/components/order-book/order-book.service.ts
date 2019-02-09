import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {CurrencyPair} from '../../../model/currency-pair.model';
import {OrderBookItem} from '../../../model/order-book-item.model';
import {Observable} from 'rxjs';

@Injectable()
export class OrderBookService {

  constructor(
    private http: HttpClient
  ) { }


  getOrderBookDateOnInit(pair: CurrencyPair,  precision: number): Observable<OrderBookItem[]> {
    const url = `${environment.apiUrl}/info/public/v2/open-orders/${pair.currencyPairId}/${precision}`;
    return this.http.get<OrderBookItem[]>(url);
  }
}

