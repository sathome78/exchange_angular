import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class OrdersService {

  private baseUrl;

  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
  }

  getOpenOrders(currencyPairId): Observable<any> {
    return this.http.get(`${this.baseUrl}/info/private/v2/dashboard/open_orders/${currencyPairId}`);
  }

  getHistory(currencyPairId, status: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/info/private/v2/dashboard/orders/${status}`,
      {params: {status: status, currencyPairId: currencyPairId }});
  }

  updateOrder(order): Observable<any> {
    return this.http.put(`api from update`, order);
  }

  createOrder(order): Observable<any> {
    return this.http.post(`api from create`, order);
  }
}
