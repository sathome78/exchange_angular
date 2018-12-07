import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BalanceItem} from '../funds/balance/balance-item.model';
import {environment} from '../../environments/environment';

@Injectable()
export class BalanceService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBalanceItems(): Observable<BalanceItem[]> {
    const url = this.apiUrl + '/info/private/v2/balances/';
    return this.http.get<BalanceItem[]>(url);
  }

}
