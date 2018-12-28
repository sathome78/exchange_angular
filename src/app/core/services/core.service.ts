import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

import {SimpleCurrencyPair} from 'app/core/models/simple-currency-pair';
import { publishReplay, refCount } from 'rxjs/operators';

@Injectable()
export class CoreService {

  apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,
  ) {}


  // request to get currency pairs
  getSimpleCurrencyPairs(): Observable<SimpleCurrencyPair[]> {
    return this.http.get<SimpleCurrencyPair[]>(`${this.apiUrl}/info/public/v2/all-pairs`);
  }

  getCryptoFiatNames(): Observable<{data: any[], error: any}> {
    const url = `${this.apiUrl}/info/private/v2/balances/transfer/currencies`;
    return this.http.get<{data: any[], error: any}>(url);
  }

  getCryptoNames(): Observable<any[]> {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/crypto-currencies`;
    return this.http.get<string[]>(url);
  }

  getFiatNames(): Observable<any[]> {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/fiat-currencies`;
    return this.http.get<string[]>(url);
  }

}
