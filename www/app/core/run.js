(function() {
	'use strict';

	angular
		.module('gamebeacon')
		.run(runBlock);

	runBlock.$inject = ['$state', '$ionicPlatform', '$ionicAnalytics', 'appConfig', 'UI', '$localStorage', 'Auth'];

	function runBlock($state, $ionicPlatform, $ionicAnalytics, appConfig, UI, $localStorage, Auth) {
		$ionicPlatform.ready(function() {

			$ionicAnalytics.register();

			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {

				//Lets hide the accessory bar fo the keyboard (ios)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				// also, lets disable the native overflow scroll
				cordova.plugins.Keyboard.disableScroll(true);
			}

			if (window.StatusBar) {
				StatusBar.styleDefault();
			}

			//checkSession();

			$ionicPlatform.on('resume', checkSession);

			function checkSession() {

				var sessionToken = $localStorage.get('sessionToken');
				if (sessionToken) {
					UI.showToast({
						msg: 'attempting auto login...'
					});

					Auth.getCurrentUser(sessionToken)
						.then(function(response) {
								UI.hideToast();
								// user has valid session token - proceed
								$state.go('app.beacons');
							},
							function(error) {
								UI.hideToast();
								// user needs to login
							})
				}
			}

			// Initialize Parse
			Parse.initialize(appConfig.parseAppKey, appConfig.parseJSKey);
		})
	}
})();
