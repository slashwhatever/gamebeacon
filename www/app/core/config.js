(function() {
	'use strict';

		angular
			.module('gamebeacon')
			.config(configure);

		configure.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider', '$ionicAppProvider', '$logProvider', '$compileProvider', 'appConfig']

	function configure($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $ionicAppProvider, $logProvider, $compileProvider, appConfig) {

		if (appConfig.productionMode) {
			$compileProvider.debugInfoEnabled(false);
			$logProvider.debugEnabled(false);
			$ionicConfigProvider.scrolling.jsScrolling(false);
		}

		// no text on back nav buttons
		$ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');

		// disable swipe to go back
		$ionicConfigProvider.views.swipeBackEnabled(false);

		$ionicAppProvider.identify({
			app_id: '9a8d7d97',
			api_key: '98133d25feed986f15023597a927f0b93686964a77106882',
			dev_push: false,
			gcm_key: "1038280762685"
		});
	}

})();
