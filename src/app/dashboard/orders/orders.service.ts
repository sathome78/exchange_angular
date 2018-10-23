import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(
    private http: HttpClient
  ) {
  }

  getOpenOrders(currencyPairId): Observable<any> {
    return this.http.get(`/info/private/v2/dashboard/open_orders/${currencyPairId}`);
  }

}
