import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {OrderItem} from './models/order-item.model';


@Injectable()
export class OrdersService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  // request to get open orders
  getOpenOrders({page,
                limit,
                dateFrom,
                dateTo,
                currencyPairId}): Observable<ResponseModel<OrderItem[]>> {
    const params = {
      page: page + '',
      limit: limit + '',
      // dateFrom,
      // dateTo,
      currencyPairId: currencyPairId || '',
    }

    return this.http.get<ResponseModel<OrderItem[]>>(`${this.apiUrl}/info/private/v2/dashboard/orders/OPENED`, {params});
  }

  // request to get closed orders
  getClosedOrders({page,
                  limit,
                  dateFrom,
                  dateTo,
                  hideCanceled,
                  currencyPairId}): Observable<ResponseModel<OrderItem[]>> {
    const params = {
      page: page + '',
      limit: limit + '',
      dateFrom,
      dateTo,
      hideCanceled: hideCanceled.toString(),
      currencyPairId: currencyPairId || '',
    }
    return this.http.get<ResponseModel<OrderItem[]>>(`${this.apiUrl}/info/private/v2/dashboard/orders/CLOSED`, {params});
  }

  // request to get closed orders
  downloadExcel({dateFrom,
               dateTo,
               hideCanceled,
               currencyPairId}): Observable<any> {
    const params = {
      dateFrom,
      dateTo,
      hideCanceled: hideCanceled.toString(),
      currencyPairId: currencyPairId || '',
    }
    return this.http.get(`${this.apiUrl}/info/private/v2/dashboard/orders/CLOSED/export`, {params, responseType: 'blob'});
  }

  // request to cancel open order
  deleteOrder(order: OrderItem): Observable<any> {
    const params = {
      order_id: '' + order.id,
    }
    return this.http.post(`${this.apiUrl}/info/private/v2/dashboard/cancel`,{}, {params});
  }
}
