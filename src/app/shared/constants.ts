
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
}

export const keys = {
  recaptchaKey: '6LdNln0UAAAAAH4nyBX7Wh4YKpqujc0-a66xssjp',
}

export const orderBaseType = {
  LIMIT: 'LIMIT',
  MARKET_PRICE: 'MARKET_PRICE',
  STOP_LIMIT: 'STOP_LIMIT',
  ICO: 'ICO'
}
