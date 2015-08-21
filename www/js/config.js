angular.module('gamebeacon.config', [])

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
		maxBeaconAge: 30,
		parseAppKey: 'G6y5BCESWE0d9IP0034FRuSXtBIOCUO5vdMUfhm1',
		parseRestKey: 'nkyyCTbVlnKZnlXE03JS72iNBFUe8iuR9Cj39K0S',
  	parseHttpsHeaders: {
    	'X-Parse-Application-Id': 'G6y5BCESWE0d9IP0034FRuSXtBIOCUO5vdMUfhm1',
    	'X-Parse-REST-API-Key': 'nkyyCTbVlnKZnlXE03JS72iNBFUe8iuR9Cj39K0S'
  	},
	  parseRestBaseUrl : 'https://api.parse.com/1/'
	}
})());
