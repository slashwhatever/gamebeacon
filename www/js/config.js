angular.module('destinybuddy.config', [])

.constant('appConfig', (function() {
	var headers = {'X-Parse-Application-Id': 'G6y5BCESWE0d9IP0034FRuSXtBIOCUO5vdMUfhm1', 'X-Parse-REST-API-Key': 'nkyyCTbVlnKZnlXE03JS72iNBFUe8iuR9Cj39K0S'},
	resDefaults = {
		get: {},
		delete: {method: 'DELETE'},
		list: {method: 'GET'},
		save: {method: 'POST'},
		update: {method: 'PUT'}
	};

	_.each(resDefaults, function(i) {
		_.extend(i, {headers: headers})
	});

	return {
		resDefaults: resDefaults,
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
	}
})());
