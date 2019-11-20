import { HttpHeaders } from '@angular/common/http';

export const MEDIA_TYPE_JSON: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

export const TOKEN = 'token';
export const USER_IP = 'user_ip';
export const X_FORWARDED_FOR = 'X-Forwarded-For';
export const X_AUTH_TOKEN = 'x-auth-token';
export const EXRATES_REST_TOKEN = 'Exrates-Rest-Token';
export const IP_CHECKER_URL = 'https://api.ipify.org/?format=json';
export const CORS_HEADER = 'Access-Control-Allow-Origin';

export const PROD_HOST = 'https://exrates.me';
export const PRE_PROD_HOST = 'http://preprod.exapp';
export const INTEGRATION_HOST = 'http://dev1.exapp';
export const DEDIK_HOST = 'https://oldex.cronpoint.com';
export const LOCAL_HOST = 'http://dev1.exapp';
export const DEV_HOST = 'http://localhost:8080';
export const QA1_HOST = 'https://qa1.exrates.tech';
export const ITEST_HOST = 'https://itest.exrates.tech';

export const CHART_PROD_HOST = 'https://chart.exrates.me';
export const CHART_PRE_PROD_HOST = 'http://chart-service-preprod.service:4102';
export const CHART_INTEGRATION_HOST = 'http://chart-service-stage.service:4103';
export const CHART_DEV_HOST = 'http://chart-service-dev.service:4104';
export const CHART_DEDIK_HOST = 'http://chart-service-preprod.service:4102';
export const CHART_LOCAL_HOST = 'http://localhost:8060';
export const CHART_QA1_HOST = 'https://chart.qa1.exrates.tech';
export const CHART_ITEST_HOST = 'http://chart.itest.exrates.tech';
