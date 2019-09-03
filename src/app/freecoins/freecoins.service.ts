import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { BalanceItem } from 'app/funds/models/balance-item.model';

@Injectable()
export class FreecoinsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // request to get balance of certain currency
  getBalanceByName(currencyId, currencyType): Observable<BalanceItem> {
    const params = {
      currencyId,
      currencyType,
      currencyName: '',
      offset: '0',
      limit: '1',
      excludeZero: 'false',
    };
    return this.http.get<ResponseModel<BalanceItem>>(`${this.apiUrl}/api/private/v2/balances`, { params })
      .pipe(map(i => i.items[0]));
  }

}
