import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';


import {environment} from '../../../../environments/environment';
import {State} from '../../reducers/dashboard.reducer';
import {RefreshCurrencyPairInfoAction} from '../../actions/dashboard.actions';

@Injectable()
export class CurrencyPairInfoService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private store: Store<State>
  ) {
  }

  getCurrencyPairInfo(currencyPairId) {
    return this.http.get(`${this.baseUrl}/info/public/v2/info/${currencyPairId}`);
  }
}
