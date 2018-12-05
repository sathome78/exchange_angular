import {HttpHeaders} from '@angular/common/http';

export const MEDIA_TYPE_JSON: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
export const TOKEN = 'token';
export const IP_USER_HEADER = 'X-Forwarded-For';
export const IP_USER_KEY = 'client_ip';
export const X_AUTH_TOKEN = 'x-auth-token';
export const EXRATES_REST_TOKEN = 'Exrates-Rest-Token';
export const IP_CHECKER_URL = 'https://jsonip.com';
export const CORS_HEADER = 'Access-Control-Allow-Origin';
// export const PROD_HOST = 'https://dev5.exrates.tech';
export const PROD_HOST = 'https://dev5.exapp';
export const STAGING_HOST = 'http://dev8.exapp';
export const LOCAL_HOST = 'http://dev7.exapp';
export const DEV_HOST = 'http://localhost:8080';

