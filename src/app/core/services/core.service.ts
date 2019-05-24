import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SimpleCurrencyPair } from 'app/model/simple-currency-pair';

@Injectable()
export class CoreService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {}

  // request to get currency pairs
  getSimpleCurrencyPairs(): Observable<SimpleCurrencyPair[]> {
    return this.http.get<SimpleCurrencyPair[]>(`${this.apiUrl}/api/public/v2/all-pairs`);
  }

  getCryptoFiatNames(): Observable<{data: any[], error: any}> {
    const url = `${this.apiUrl}/api/private/v2/balances/transfer/currencies`;
    return this.http.get<{data: any[], error: any}>(url);
  }

  getCryptoNames(): Observable<any[]> {
    const url = `${this.apiUrl}/api/private/v2/balances/refill/crypto-currencies`;
    return this.http.get<string[]>(url);
  }

  getFiatNames(): Observable<any[]> {
    const url = `${this.apiUrl}/api/private/v2/balances/refill/fiat-currencies`;
    return this.http.get<string[]>(url);
  }

}
