
export const BUY = 'BUY';
export const SELL = 'SELL';
export const PENDING = 'PENDING';


// for KYC
export const NOT_VERIFIED = 'NOT_VERIFIED';
export const LEVEL_ONE = 'LEVEL_ONE';
export const LEVEL_TWO = 'LEVEL_TWO';


// Authentication messages

export const AUTH_MESSAGES = {
  'USER_CREDENTIALS_NOT_COMPLETE': 'User credentials not complete.',
  'USER_EMAIL_NOT_FOUND': 'This email doesn\'t exist',
  'USER_REGISTRATION_NOT_COMPLETED': 'Seems, that your user is still inactive. Email with activation link has been sent again to your email address. Please, check and follow the instructions.',
  'USER_NOT_ACTIVE': 'Your account has been blocked. To find out the reason of blocking - contact the exchange support service.',
  'REQUIRED_EMAIL_AUTHORIZATION_CODE': 'Required email authorization code.',
  'REQUIRED_GOOGLE_AUTHORIZATION_CODE': 'Required Google authorization code.',
  'EMAIL_AUTHORIZATION_FAILED': 'Email authorization failed.',
  'GOOGLE_AUTHORIZATION_FAILED': 'Google authorization failed.',
  'FAILED_TO_GET_USER_TOKEN': 'Failed to get user token.',
  'INVALID_CREDENTIALS': 'Invalid credentials',
  'OTHER_HTTP_ERROR' : 'Service is temporary unavailable, please try again later.',
  'EMAIL_EXIST' : 'Email exists.'
}

export const KYC_STATUS = {
  'NONE': 'none',
  'CREATED': 'CREATED',
  'CLICKED': 'CLICKED',
  'CAPTURE_ONGOING': 'CAPTURE_ONGOING',
  'SUCCESS': 'SUCCESS',
  'TECHNICAL_ERROR': 'TECHNICAL_ERROR',
  'TOO_MANY_ANALYSIS': 'TOO_MANY_ANALYSIS',
  'EXPIRED': 'EXPIRED',
};

export const keys = {
  recaptchaKey: '6LdNln0UAAAAAH4nyBX7Wh4YKpqujc0-a66xssjp',
};

export const orderBaseType = {
  LIMIT: 'LIMIT',
  MARKET_PRICE: 'MARKET_PRICE',
  STOP_LIMIT: 'STOP_LIMIT',
  ICO: 'ICO'
};

export const API_KEY_2FA_FOR = {
  'NEW_KEY': 'NEW_KEY',
  'ENABLE_TRADING_FOR_KEY': 'ENABLE_TRADING_FOR_KEY',
};

export const LANG_SUPPORT = [
  'ar',
  'zh',
  'cs',
  'da_DK',
  'nl_NL',
  'en',
  'et_EE',
  'fr',
  'de',
  'el',
  'he_IL',
  'hu_HU',
  'id_ID',
  'it',
  'ja',
  'ko',
  'fa',
  'pl',
  'pt',
  'ro',
  'ru',
  'sk_SK',
  'es',
  'sv',
  'th',
  'tr',
  'vi'
]

export const GRAPH_TIME_ZONE_SUPPORT = [
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'America/Phoenix',
  'America/Toronto',
  'America/Vancouver',
  'America/Argentina/Buenos_Aires',
  'America/El_Salvador',
  'America/Sao_Paulo',
  'America/Bogota',
  'America/Caracas',
  'Europe/Moscow',
  'Europe/Athens',
  'Europe/Belgrade',
  'Europe/Berlin',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Paris',
  'Europe/Rome',
  'Europe/Warsaw',
  'Europe/Istanbul',
  'Europe/Zurich',
  'Australia/Sydney',
  'Australia/Brisbane',
  'Australia/Adelaide',
  'Australia/ACT',
  'Asia/Almaty',
  'Asia/Ashkhabad',
  'Asia/Tokyo',
  'Asia/Taipei',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Seoul',
  'Asia/Tehran',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Hong_Kong',
  'Asia/Bangkok',
  'Asia/Chongqing',
  'Asia/Jerusalem',
  'Asia/Kuwait',
  'Asia/Muscat',
  'Asia/Qatar',
  'Asia/Riyadh',
  'Pacific/Auckland',
  'Pacific/Chatham',
  'Pacific/Fakaofo',
  'Pacific/Honolulu',
  'America/Mexico_City',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Kathmandu',
  'US/Mountain',
  'Europe/Kiev'
];
