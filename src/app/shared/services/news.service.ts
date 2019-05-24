import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BalanceItem } from '../../funds/models/balance-item.model';

@Injectable()
export class NewsService {

  public HOST = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {
  }

  subscribeToPartnerNews(email: string) {
    // send email to back-end
    console.log('send to back' + email);
    return of(true);
  }

  getRssNewsFeed(count, resourceIndex, offset) {
    const params = {
      count: count || 10,
      index: resourceIndex || 0,
      offset: offset || 0,
    };
    return this.http.get(`${this.HOST}/api/public/v2/news`, { params });
  }
}
