(function() {
	'use strict';

	angular.module('gamebeacon.core', [
		/*
		 * Ionic modules
		 */


		'blocks.router',

		'ionic',
		'ionic.service.core',
		'ionic.service.deploy',
		'ionic.service.analytics',
		'ionic.service.push',
		'ngCordova',
		'templates',
		'ng-mfb',
		'ngIOS9UIWebViewPatch'

	]);
})();
