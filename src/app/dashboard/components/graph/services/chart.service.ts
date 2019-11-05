import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BarData } from 'app/model/bar-data.model';

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
    return this.http.get<BarData[]>(url, { params });
  }
}
