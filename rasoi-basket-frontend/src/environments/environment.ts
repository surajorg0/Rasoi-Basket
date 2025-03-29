// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Development API URLs (choose the appropriate one)
  // apiUrl: 'http://10.0.2.2:3000/api', // For Android emulator testing
  // apiUrl: 'http://localhost:3000/api', // For local browser testing
  // Use a publicly accessible backend - replace with your actual deployed backend URL
  apiUrl: 'https://rasoi-basket-api.onrender.com/api', // Public API for all users
  defaultMapZoom: 15
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
