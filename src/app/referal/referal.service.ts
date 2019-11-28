import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReferralLink } from './models/referral-link.model';

const mainLinks = [
  {
    numberChild: 0,
    name: 'My Custom structure 1',
    link: 'http://localhost:8080/register?ref=0a74bdff-b658-4229-ad7e-8b0b2c41fec7',
    earnedBTC: 0,
    earnedUSD: 0,
    earnedUSDT: 0,
    main: false,
    level: null,
    userId: null,
    userEmail: null,
  },
  {
    numberChild: 1,
    name: 'My referral structure #1',
    link: 'http://localhost:8080/register?ref=116aa9ad-046b-4d5d-9db9-7f04e440d925',
    earnedBTC: 0.303,
    earnedUSD: 100,
    earnedUSDT: 0,
    main: true,
    level: null,
    userId: null,
    userEmail: null,
  },
];

const childs1Links = [
  {
    numberChild: 1,
    name: null,
    link: null,
    earnedBTC: 0,
    earnedUSD: 0,
    earnedUSDT: 0,
    main: false,
    level: 1,
    userId: 17102,
    userEmail: 'staszp1@gmail.com',
  },
];
const childs2Links = [
  {
    numberChild: 1,
    name: null,
    link: null,
    earnedBTC: 0,
    earnedUSD: 0,
    earnedUSDT: 0,
    main: false,
    level: 2,
    userId: 17101,
    userEmail: 'staszp2@gmail.com',
  },
];
const childs3Links = [
  {
    numberChild: 0,
    name: null,
    link: null,
    earnedBTC: 0,
    earnedUSD: 0,
    earnedUSDT: 0,
    main: false,
    level: 3,
    userId: 17103,
    userEmail: 'staszp3@gmail.com',
  },
];

@Injectable()
export class ReferralService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyReferralLinks(): Observable<ReferralLink[]> {
    // return this.http.get<ReferralLink[]>(`${this.apiUrl}/api/private/v2/referral/my`);
    return of(mainLinks);
  }

  getChildsReferralLinks(level: string, userId: string): Observable<ReferralLink[]> {
    const params = {
      level,
      userId,
    };
    if (+level === 1) {
      return of(childs2Links);
    }
    if (+level === 2) {
      return of(childs3Links);
    }
    // return this.http.get<ReferralLink[]>(`${this.apiUrl}/api/private/v2/referral/structure`, { params });
  }

  getFirstChildsReferralLinks(link, userId): Observable<ReferralLink[]> {
    const params = {
      userId,
      level: '0',
      link: this.getLinkId(link),
    };
    // return this.http.get<ReferralLink[]>(`${this.apiUrl}/api/private/v2/referral/structure`, { params });
    return of(childs1Links);
  }

  createNewReferralLink(name): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/private/v2/referral`, { name });
  }

  changeReferralLinkName(name, link): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/private/v2/referral/${this.getLinkId(link)}`, { name });
  }

  getLinkId(url_string) {
    const url = new URL(url_string);
    const ref = url.searchParams.get('ref');
    console.log(ref);
    return ref;
  }

}

// api/public/v2/users/register Регистрация нового юзера POST (edited)
// {
// 	'email':'renohi5832@tmail1.com',
// 	'password':'R1dGQVIABwI=',
// 	'inviteCode':'116aa9ad-046b-4d5d-9db9-7f04e440d925",
// 	'isUsa':false
// }
