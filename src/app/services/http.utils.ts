import {HttpHeaders} from '@angular/common/http';

export const MEDIA_TYPE_JSON: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
export const TOKEN = 'token';
export const IP_USER_HEADER = 'X-Forwarded-For';
export const IP_USER_KEY = 'client_ip';
export const X_AUTH_TOKEN = 'x-auth-token';
export const EXRATES_REST_TOKEN = 'Exrates-Rest-Token';

export class HttpUtils {

}
