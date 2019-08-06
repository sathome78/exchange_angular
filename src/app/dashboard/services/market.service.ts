import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class MarketService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * this method simply gets pairs from cache and when subscription is on we should drop data
   */
  // getCurrencyPairs(): Observable<CurrencyPair[]> {
  //   const url = this.baseUrl + '/api/public/v2/currencies/fast';
  //   return this.http.get<CurrencyPair[]>(url)
  // }

  getUserFavoriteCurrencyPairIds(): Observable<number[]> {
    const url = this.baseUrl + '/api/private/v2/settings/currency_pair/favourites';
    return this.http.get<number[]>(url);
  }

  removeFavorites() {
    const url = this.baseUrl + '/api/private/v2/settings/currency_pair/favourites';
    return this.http.delete<number>(url);
  }

  manageUserFavoriteCurrencyPair(currencyPairId: number, isFavorite: boolean): Observable<number> {
    const data: { PAIR_ID: string; TO_DELETE: string } = {
      PAIR_ID: currencyPairId + '',
      TO_DELETE: isFavorite + '',
    };
    const url = this.baseUrl + '/api/private/v2/settings/currency_pair/favourites';
    return this.http.put<number>(url, data);
  }
}
