import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class BalanceService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {

  }

  getCryptoNames(): Observable<any[]> {
    const url = `${this.baseUrl}/info/private/v2/balances/refill/crypto-currencies`;
    return this.http.get<string[]>(url);
  }

  getFiatNames(): Observable<any[]> {
    const url = `${this.baseUrl}/info/private/v2/balances/refill/fiat-currencies`;
    return this.http.get<string[]>(url);
  }

  getCurrencyData(cryptoName: string) {
    const httpOptions = {
      params:  new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.baseUrl}/info/private/v2/balances/refill/merchants/input`;
    return this.http.get<string[]>(url, httpOptions);
  }

  refill(data) {
    const url = `${this.baseUrl}/info/private/v2/balances/refill/request/create`;
    return this.http.post(url, data);
  }

  sendTransferCode() {
    const url = `${this.baseUrl}`;
    return this.http.get(url);
  }
}
