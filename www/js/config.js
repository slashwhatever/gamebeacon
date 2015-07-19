angular.module('destinybuddy.config', [])

.constant('DB_CONFIG', {
  name: 'DestinyManifestDB',
  path: '//destinybuddy.parseapp.com/sql/manifest.content',
  tables: [
    {
      name: 'activities',
      columns: [
        {name: 'id', type: 'integer primary key'},
        {name: 'title', type: 'text'},
        {name: 'keywords', type: 'text'},
        {name: 'version', type: 'integer'},
        {name: 'release_date', type: 'text'},
        {name: 'filename', type: 'text'},
        {name: 'context', type: 'text'}
      ]
    }
  ]
})


.constant('appConfig', {

  parseHttpsHeaders: {
    'X-Parse-Application-Id': 'G6y5BCESWE0d9IP0034FRuSXtBIOCUO5vdMUfhm1',
    'X-Parse-REST-API-Key': 'nkyyCTbVlnKZnlXE03JS72iNBFUe8iuR9Cj39K0S'
  },
  parseRestBaseUrl : 'https://api.parse.com/1/',
  baseURL: 'http://www.bungie.net/Platform/',
  userEndpoint: PROXY_ADDRESS + '/Platform/User/',
  destinyEndpoint: PROXY_ADDRESS + '/Platform/Destiny/',
  apiKey: '8ff5f227e3984b679dee74a0d8aa2cfd',
  testUserId: '4090021'

})
