// angular.module is a global place for creating, registering and retrieving Angular modules
// 'gamebeacon' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'gamebeacon.controllers' is found in controllers.js
//

(function() {
	'use strict';

	angular.module('gamebeacon', [
		'ionic',
		'ionic.service.core',
		'ionic.service.deploy',
		'ionic.service.analytics',
		'ionic.service.push',
		/*
		 * Everybody has access to these.
		 * We could place these under every feature area,
		 * but this is easier to maintain.
		 */
		'gamebeacon.core',
		'gamebeacon.service',
		'gamebeacon.widgets',

		'blocks.exception', 'blocks.logger', 'blocks.router',

		/*
		 * Feature areas
		 */

		'gamebeacon.beacon',
		'gamebeacon.dashboard',
		'gamebeacon.login',
		'gamebeacon.tutorial',
		'gamebeacon.user',
		'gamebeacon.about'

	]);

})();
