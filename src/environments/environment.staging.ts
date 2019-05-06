// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// ng build --configuration=staging

// test
import {STAGING_HOST} from '../app/shared/services/http.utils';

export const environment = {
  production: false,
  apiUrl: STAGING_HOST,
  showContent: true,
  encodeKey: '3255c246-4b9f-43a5-b2dd-63524f959953',
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
