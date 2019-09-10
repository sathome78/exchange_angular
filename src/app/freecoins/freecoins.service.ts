import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { BalanceItem } from 'app/funds/models/balance-item.model';
import { GAFreeCoinsReqModel, GAFreeCoinsPublicResModel, GAFreeCoinsPrivateResModel } from './models/GAFreeCoins.model';

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

  // request to post to give away coins
  giveAwayCurrency(data: GAFreeCoinsReqModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/private/v2/free-coins/giveaway`, data);
  }

  // request to get list of free coins
  getFreeCoinsPublic(): Observable<GAFreeCoinsPublicResModel[]> {
    return this.http.get<GAFreeCoinsPublicResModel[]>(`${this.apiUrl}/api/public/v2/free-coins/giveaway/all`);
  }

  // request to get user state by free coins
  getFreeCoins(): Observable<{[id: string]: GAFreeCoinsPrivateResModel}> {
    return this.http.get<{[id: string]: GAFreeCoinsPrivateResModel}>(
      `${this.apiUrl}/api/private/v2/free-coins/receive/all`
    );
  }

  // request to receive free coins
  recieveCoins(id) {
    return this.http.post<any>(`${this.apiUrl}/api/private/v2/free-coins/receive?giveaway_id=${id}`, {});
  }

}
