// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'https://bolt-back.herokuapp.com/api/v1/',
  login: {
    resource: '/oauth/token?_format=json',
  },
  logout: {
    resource: '/user/logout',
  },
  banners: {
    getAll: 'banners',
    post: 'banners',
    upload: 'upload',
    getById: 'banners/',
    putById: 'banners/',
    deleteById: 'banners/',
  },
  projects: {
    get: 'projects',
    getAll: 'projects/menu',
    post: 'projects',
    getById: 'projects/',
    putById: 'projects/',
    deleteById: 'projects/',
  },
  submenus: {
    getAll: 'apps',
    post: 'apps',
    getById: 'apps/',
    putById: 'apps/',
    deleteById: 'apps/',
  },
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
