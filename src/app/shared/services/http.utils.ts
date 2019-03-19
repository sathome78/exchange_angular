import {HttpHeaders} from '@angular/common/http';

export const MEDIA_TYPE_JSON: HttpHeaders = new HttpHeaders()
  .set('Content-Type', 'application/json');

export const TOKEN = 'token';
export const USED_IP = 'user_ip';
export const X_FORWARDED_FOR = 'X-Forwarded-For';
export const X_AUTH_TOKEN = 'x-auth-token';
export const EXRATES_REST_TOKEN = 'Exrates-Rest-Token';
export const IP_CHECKER_URL = 'https://api.ipify.org/?format=json';
export const CORS_HEADER = 'Access-Control-Allow-Origin';

export const PROD_HOST = 'https://exrates.me';
export const PRE_PROD_HOST = 'http://preprod.exapp';
export const STAGING_HOST = 'http://dev1.exrates.tech';
export const LOCAL_HOST = 'http://dev1.exrates.tech';

export const PROD_HOST_WS = 'wss://exrates.me';
export const PRE_PROD_HOST_WS = 'ws://preprod.exapp';
export const STAGING_HOST_WS = 'ws://dev1.exrates.tech';
export const LOCAL_HOST_WS = 'ws://dev1.exrates.tech';

export const DEV_HOST = 'http://localhost:8080';
export const DEV_HOST_WS = 'ws://localhost:8080';

