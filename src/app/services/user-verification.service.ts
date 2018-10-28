import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserInfoVerificationModel} from '../popups/identity-popup/user-info-verification.model';
import {UserDocVerificationModel} from '../popups/identity-popup/user-doc-verification.model';

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

  public uploadVerificationInfo(dto: UserInfoVerificationModel): Observable<number> {
    const url = this.host + '/info/private/v2/settings/userFiles';
    return this.http.post<number>(url, dto);
  }

  public uploadVerificationDoc(data: UserDocVerificationModel): Observable<number> {
    const url = this.host + '/info/private/v2/settings/userFiles/docs';
    return this.http.post<number>(url, data);
  }

}
