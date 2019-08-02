import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { OrderItem } from './models/order-item.model';

@Injectable()
export class OrdersService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  // request to get open orders
  getOpenOrders({ page, limit, currencyPairId }): Observable<ResponseModel<OrderItem[]>> {
    const params = {
      page: page + '',
      limit: limit + '',
      currencyPairId,
      currencyPairName: '',
      scope: 'ALL',
    };
    return this.http.get<ResponseModel<OrderItem[]>>(`${this.apiUrl}/api/private/v2/dashboard/orders/OPENED`, { params });
  }

  // request to get closed orders
  getClosedOrders({
    page,
    limit,
    dateFrom,
    dateTo,
    hideCanceled,
    currencyPairName,
    currencyPairId,
  }): Observable<ResponseModel<OrderItem[]>> {
    const params: any = {
      page: page + '',
      limit: limit + '',
      hideCanceled: hideCanceled.toString(),
      currencyPairName,
      currencyPairId,
      scope: 'ALL',
    };
    if (dateFrom) {
      params.dateFrom = encodeURIComponent(dateFrom);
    }
    if (dateTo) {
      params.dateTo = encodeURIComponent(dateTo);
    }
    return this.http.get<ResponseModel<OrderItem[]>>(`${this.apiUrl}/api/private/v2/dashboard/orders/CLOSED`, { params });
  }
  // request to get last closed orders
  getLastClosedOrders({ page, limit }): Observable<ResponseModel<OrderItem[]>> {
    const params: any = {
      page: page + '',
      limit: limit + '',
      scope: 'ALL',
    };
    return this.http.get<ResponseModel<OrderItem[]>>(`${this.apiUrl}/api/private/v2/dashboard/last/orders/CLOSED`, { params });
  }

  // request to get closed orders
  downloadExcel({ dateFrom, dateTo, hideCanceled, currencyPairId, currencyPairName }): Observable<any> {
    const params = {
      hideCanceled: hideCanceled.toString(),
      currencyPairId,
      scope: 'ALL',
      currencyPairName,
    };
    if (dateFrom) {
      params['dateFrom'] = encodeURIComponent(dateFrom);
    }
    if (dateTo) {
      params['dateTo'] = encodeURIComponent(dateTo);
    }
    return this.http.get(`${this.apiUrl}/api/private/v2/download/orders/CLOSED/export`, { params, responseType: 'blob' });
  }

  // request to cancel open order
  deleteOrder(order: OrderItem): Observable<any> {
    const params = {
      order_id: '' + order.id,
      type: order.orderBaseType,
    };
    return this.http.post(`${this.apiUrl}/api/private/v2/dashboard/cancel`, {}, { params });
  }

  cancelAllOrders(currency_pair?: string): Observable<any> {
    const url = `${this.apiUrl}/api/private/v2/dashboard/cancel/all`;
    const params = {
      currency_pair: currency_pair.toLowerCase(),
    };
    return !currency_pair ? this.http.post(url, {}) : this.http.post(url, {}, { params });
  }
}
