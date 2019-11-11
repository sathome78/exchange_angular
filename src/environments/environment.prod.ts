import { CHART_PROD_HOST, PROD_HOST } from '../app/shared/services/http.utils';

export const environment = {
  production: true,
  apiUrl: PROD_HOST,
  chartApiUrl: CHART_PROD_HOST,
  showContent: false,
  captcha: true,
  encodeKey: '3255c246-4b9f-43a5-b2dd-63524f959953',
};
