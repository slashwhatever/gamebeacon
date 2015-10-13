(function() {
	'use strict';

	angular.module('gamebeacon.core', [
		/*
		 * Ionic modules
		 */


		'blocks.exception', 'blocks.logger', 'blocks.router',


		'ngCordova',
		'templates',
		'ng-mfb',
		'ngIOS9UIWebViewPatch'

	]);
})();