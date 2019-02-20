import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class CurrencyPairInfoService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {
  }

  getCurrencyPairInfo(currencyPairId) {
    return this.http.get(`${this.baseUrl}/api/public/v2/info/${currencyPairId}`);
  }
}
