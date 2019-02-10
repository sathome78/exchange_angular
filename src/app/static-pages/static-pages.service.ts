import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable()
export class StaticPagesService {

  private HOST = environment.apiUrl;

  constructor(
    private http: HttpClient) {}

  public sendContactForm(data): Observable<string> {
    const url = `${this.HOST}/info/public/v2/listing/mail/send`;
    return this.http.post<string>(url, data);
  }

}
