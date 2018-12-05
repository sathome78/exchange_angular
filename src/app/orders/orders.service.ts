import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {OrderWrapper} from './models/order-wrapper.model';
import { OrderCurrencyPair } from './models/order-currency-pair';


@Injectable()
export class OrdersService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  // request to get open orders
  getOpenOrders(page: number, 
                limit: number, 
                from?: string, 
                to?: string, 
                currencyPairId?: string): Observable<OrderWrapper> {
    const params = {
      page: page + '',
      limit: limit + '',
      from,
      to,
      currencyPairId: currencyPairId || '',
    }

    return this.http.get<OrderWrapper>(`${this.apiUrl}/info/private/v2/dashboard/orders/OPENED`, {params});
  }

  // request to get closed orders
  getClosedOrders(page: number, 
                  limit: number, 
                  from?: string, 
                  to?: string, 
                  hideCanceled?: boolean,
                  currencyPairId?: string): Observable<OrderWrapper> {
    const params = {
      page: page + '',
      limit: limit + '',
      from,
      to,
      hideCanceled: hideCanceled.toString(),
      currencyPairId: currencyPairId || '',
    }
    return this.http.get<OrderWrapper>(`${this.apiUrl}/info/private/v2/dashboard/orders/CLOSED`, {params});
  }

  // request to get currency pairs
  getCurrencyPairs(): Observable<OrderCurrencyPair[]> {
    return this.http.get<OrderCurrencyPair[]>(`${this.apiUrl}/info/public/v2/all-pairs`);
  }
}
