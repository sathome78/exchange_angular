import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TransactionHistoryItem} from '../models/transactions-history-item.model';

@Injectable()
export class TransactionsService {

  apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,
  ) {
  }

  // request to get balances
  getTransactionsHistory({
    currencyId,
    offset,
    limit,
    dateFrom,
    dateTo,
  }): Observable<ResponseModel<TransactionHistoryItem[]>> {
    const params = {
      limit: limit + '',
      offset: offset + '',
    }
    if(dateTo) {
      params['dateTo'] = dateTo;
    }
    if(dateFrom) {
      params['dateFrom'] = dateFrom;
    }
    if(currencyId) {
      params['currencyId'] = currencyId;
    }
    return this.http.get<ResponseModel<TransactionHistoryItem[]>>(`${this.apiUrl}/api/private/v2/balances/inputOutputData`, {params});
  }

  // request to get last transactions history
  getLastTransactionsHistory({
    offset,
    limit,
  }): Observable<ResponseModel<TransactionHistoryItem[]>> {
    const params = {
      limit: limit + '',
      offset: offset + '',
    }
    return this.http.get<ResponseModel<TransactionHistoryItem[]>>(`${this.apiUrl}/api/private/v2/balances/inputOutputData/default`, {params});
  }

  // request to get closed orders
  downloadExcel({
                  currencyId,
                }): Observable<any> {
    const params = {};
    if (currencyId) {
      params['currencyId'] = currencyId;
    }
    // TODO change url
    return this.http.get(`${this.apiUrl}/api/private/v2/download/inputOutputData/excel`, {params, responseType: 'blob'});
  }

}
