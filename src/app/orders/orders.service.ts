import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {OrderWrapper} from './order-wrapper.model';


@Injectable()
export class OrdersService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  // from and to - dates
  getOpenOrders(page: number, limit: number, from?: string, to?: string): Observable<OrderWrapper> {
    const params = {
      page: page + '',
      limit: limit + '',
      from,
      to,
    }

    return this.http.get<OrderWrapper>(`${this.apiUrl}/info/private/v2/dashboard/orders/OPENED`, {params});
  }

  getClosedOrders(from?: string, to?: string): Observable<OrderWrapper> {
    return this.http.get<OrderWrapper>(`${this.apiUrl}/info/private/v2/dashboard/orders/CLOSED`);
  }
}
