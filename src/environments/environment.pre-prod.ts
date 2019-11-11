import { CHART_PRE_PROD_HOST, PRE_PROD_HOST } from '../app/shared/services/http.utils';

export const environment = {
  production: true,
  apiUrl: PRE_PROD_HOST,
  chartApiUrl: CHART_PRE_PROD_HOST,
  showContent: true,
  captcha: true,
  encodeKey: '3255c246-4b9f-43a5-b2dd-63524f959953',
};
