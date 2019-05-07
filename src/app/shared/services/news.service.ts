import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

@Injectable()
export class NewsService {

  public HOST = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  subscribeToPartnerNews(email: string) {
    // send email to back-end
    console.log('send to back' + email);
    return of(true);
  }
}
