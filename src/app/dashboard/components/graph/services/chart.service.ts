import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BarData } from 'app/model/bar-data.model';

export class ChartService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getHistory(symbol, resolution, from, to): Observable<BarData[]> {
    const params = {
      symbol,
      resolution,
      from,
      to,
    };
    const url = `${this.apiUrl}/api/public/v2/graph/history`;
    return this.http.get<BarData[]>(url, { params });
  }
}
