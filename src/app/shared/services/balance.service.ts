import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {BalanceItem} from '../../funds/balance/balance-item.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class BalanceService {

  apiUrl = environment.apiUrl;
  public goToPinCode$ = new Subject();
  public goToSendMoneySuccess$ = new Subject();
  public goToSendMoneyInnerTransfer$ = new Subject();

  constructor(
    private http: HttpClient
  ) {
  }

  getBalanceItems(): Observable<BalanceItem[]> {
    const url = this.apiUrl + '/info/private/v2/balances/';
    return this.http.get<BalanceItem[]>(url);
  }

  getCryptoNames(): Observable<any[]> {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/crypto-currencies`;
    return this.http.get<string[]>(url);
  }

  getFiatNames(): Observable<any[]> {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/fiat-currencies`;
    return this.http.get<string[]>(url);
  }

  getCurrencyData(cryptoName: string) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/info/private/v2/balances/refill/merchants/input`;
    return this.http.get<string[]>(url, httpOptions);
  }

  refill(data) {
    const url = `${this.apiUrl}/info/private/v2/balances/refill/request/create`;
    return this.http.post(url, data);
  }

  getCryptoMerchants(cryptoName) {
    const httpOptions = {
      params: new HttpParams().set('currency', cryptoName)
    };
    const url = `${this.apiUrl}/info/private/v2/balances/withdraw/merchants/output`;
    return this.http.get(url, httpOptions);
  }

  sendTransferCode(code: string) {
    const data = {CODE: code};
    const url = `${this.apiUrl}/info/private/v2/balances/transfer/accept`;
    return this.http.post(url, data);
  }

  sendPinCode() {
    const url = `${this.apiUrl}/info/private/v2/balances/withdraw/request/pin`;
    return this.http.get(url);
  }

  withdrawRequest(data) {
    const url = `${this.apiUrl}/info/private/v2/balances/withdraw/request/create`;
    return this.http.post(url, data);
  }

  getTotalBalance() {
    const url = `${this.apiUrl}/info/private/v2/balances/totalBalance`;
    return this.http.get(url);
  }

  getCommisionInfo(currency: string, amount: string, type: string) {
    let httpOptions = new HttpParams();
    httpOptions = httpOptions.append('currency', currency);
    httpOptions = httpOptions.append('amount', amount);
    httpOptions = httpOptions.append('type', type);
    {
      const url = `${this.apiUrl}/info/private/v2/balances/transfer/voucher/commission`;
      return this.http.get(url, {params: httpOptions});
    }
  }
}
