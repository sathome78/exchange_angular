import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class OrdersService {
  private apiUrl;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  getOpenOrders(currencyPairId): Observable<any> {
    return this.http.get(`${this.apiUrl}info/private/v2/dashboard/open_orders/${currencyPairId}`);
  }

}
