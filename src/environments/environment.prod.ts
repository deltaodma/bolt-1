export const environment = {
  production: true,
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
    getAll: 'projects',
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
