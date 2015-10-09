/* global toastr:false, moment:false */
(function() {
	'use strict';

	angular
		.module('gamebeacon.core')
		.constant('appConfig', {
			productionMode: false,
			maxBeaconAge: 30,
			parseAppKey: 'G6y5BCESWE0d9IP0034FRuSXtBIOCUO5vdMUfhm1',
			parseJSKey: 'DK9nUcIYyHQRMYg1toAX784gci4j9u23aNRacZiP',
			parseRestKey: 'nkyyCTbVlnKZnlXE03JS72iNBFUe8iuR9Cj39K0S',
			parseHttpsHeaders: {
				'X-Parse-Application-Id': 'G6y5BCESWE0d9IP0034FRuSXtBIOCUO5vdMUfhm1',
				'X-Parse-REST-API-Key': 'nkyyCTbVlnKZnlXE03JS72iNBFUe8iuR9Cj39K0S'
			},
			parseRestBaseUrl: 'https://api.parse.com/1/'
		})
})();
