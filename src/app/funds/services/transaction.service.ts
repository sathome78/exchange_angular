import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionHistoryItem } from '../models/transactions-history-item.model';

@Injectable()
export class TransactionsService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  // request to get balances
  getTransactionsHistory({
    currencyId,
    currencyName,
    offset,
    limit,
    dateFrom,
    dateTo,
  }): Observable<ResponseModel<TransactionHistoryItem[]>> {
    const params = {
      limit: limit + '',
      offset: offset + '',
      currencyId,
      currencyName,
    };
    if (dateTo) {
      params['dateTo'] = encodeURIComponent(dateTo);
    }
    if (dateFrom) {
      params['dateFrom'] = encodeURIComponent(dateFrom);
    }
    return this.http.get<ResponseModel<TransactionHistoryItem[]>>(`${this.apiUrl}/api/private/v2/balances/inputOutputData`, { params });
  }

  // request to get last transactions history
  getLastTransactionsHistory({
    offset,
    limit,
  }): Observable<ResponseModel<TransactionHistoryItem[]>> {
    const params = {
      limit: limit + '',
      offset: offset + '',
    };
    return this.http.get<ResponseModel<TransactionHistoryItem[]>>(`${this.apiUrl}/api/private/v2/balances/inputOutputData/default`, { params });
  }

  // request to get closed orders
  downloadExcel({
    currencyId,
    currencyName,
    dateFrom,
    dateTo,
  }): Observable<any> {
    const params = {
      currencyId,
      currencyName,
    };
    if (dateTo) {
      params['dateTo'] = encodeURIComponent(dateTo);
    }
    if (dateFrom) {
      params['dateFrom'] = encodeURIComponent(dateFrom);
    }
    return this.http.get(`${this.apiUrl}/api/private/v2/download/inputOutputData/excel`, { params, responseType: 'blob' });
  }

}
