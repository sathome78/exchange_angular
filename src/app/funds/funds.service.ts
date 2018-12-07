import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BalanceItem} from './models/balance-item.model';
import {environment} from '../../environments/environment';
import { BalanceWrapper } from './models/balance-wrapper.model';

@Injectable()
export class FundsService {

  apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  // request to get crypto balances
  getCryptoBalances({offset, 
                    limit,
                    excludeZero}): Observable<BalanceWrapper> {
                    
    const params = {
      offset: offset + '',
      limit: limit + '',
      currencyType: 'CRYPTO',
      excludeZero: (!!excludeZero).toString(),
    }

    return this.http.get<BalanceWrapper>(`${this.apiUrl}/info/private/v2/balances`, {params});
  }
}
