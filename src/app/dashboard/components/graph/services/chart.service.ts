import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BarData } from 'app/model/bar-data.model';
import { catchError, timeout } from 'rxjs/operators';

export class ChartService {

  chartApiUrl = environment.chartApiUrl;

  constructor(private http: HttpClient) {
  }

  getHistory(symbol, resolution, from, to): Observable<BarData[]> {
    const params = {
      resolution,
      from,
      to,
      currencyPair: symbol,
    };
    const url = `${this.chartApiUrl}/data/range`;
    return this.http.get<BarData[]>(url, { params })
      .pipe(timeout(10000), catchError(error => {
        // console.log('getHistory timeout exception -->');

        return of([]);
      }));
  }

  getLastBarTime(symbol, resolution, from): Observable<number> {
    const params = {
      resolution,
      to: from,
      currencyPair: symbol,
    };
    const url = `${this.chartApiUrl}/data/last-date`;
    return this.http.get<number>(url, { params })
      .pipe(timeout(10000), catchError(error => {
        // console.log('getLastBarTime timeout exception -->');

        return of(null);
      }));
  }
}
