import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ApiKeysService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  public getApiKeys(): Observable<any> {
   return this.http.get(`${this.apiUrl}/api/private/v2/settings/token/findAll`);
  }

  public createApiKey(alias: string, pin: string = ''): Observable<any> {
    const params = {alias, pin};
    const url = `${this.apiUrl}/api/private/v2/settings/token/create`;
    return this.http.post(url, {}, {params});
  }

  public changeAllowTrade(tokenId, allowTrade, pin = null): Observable<any> {
    const params = {tokenId, allowTrade, pin};
    const url = `${this.apiUrl}/api/private/v2/settings/token/allowTrade`;
    return this.http.post(url, {}, {params});
  }


  public deleteApiKey(tokenId): Observable<any> {
    const params = {tokenId};
    const url = `${this.apiUrl}/api/private/v2/settings/token/delete`;
    return this.http.post(url, {}, {params});
  }

}
