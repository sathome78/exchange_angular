import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserInfoVerificationModel } from '../../popups/identity-popup/user-info-verification.model';
import { UserDocVerificationModel } from '../../popups/identity-popup/user-doc-verification.model';
import { KycCountry } from '../interfaces/kyc-country-interface';

@Injectable()
export class UserVerificationService {

  private host = environment.apiUrl;
  private verificationMode = 'DOCUMENT';

  constructor(private http: HttpClient) {}

  public getVerificationMode(): string {
    return this.verificationMode;
  }

  public setVerificationMode(value: string) {
    this.verificationMode = value;
  }

  public getCountryList(): Observable<KycCountry[]> {
    const url = this.host + '/api/private/v2/kyc/countries';
    return this.http.get<KycCountry[]>(url);
  }

  public uploadVerificationInfo(dto: UserInfoVerificationModel): Observable<number> {
    const url = this.host + '/api/private/v2/settings/userFiles';
    return this.http.post<number>(url, dto);
  }

  public uploadVerificationDoc(data: UserDocVerificationModel): Observable<number> {
    const url = this.host + '/api/private/v2/settings/userFiles/docs';
    return this.http.post<number>(url, data);
  }

  public sendKYCData(data: any): Observable<any> {
    return this.http.post(`${this.host}/api/private/v2/kyc/start`, data);
  }

}
