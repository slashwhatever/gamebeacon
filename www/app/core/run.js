(function() {
	'use strict';

	angular
		.module('gamebeacon')
		.run(runBlock);

	runBlock.$inject = ['$state', '$ionicPlatform', '$ionicAnalytics', 'appConfig', 'UIService', '$localStorage', 'AuthService'];

	function runBlock($state, $ionicPlatform, $ionicAnalytics, appConfig, UIService, $localStorage, AuthService) {
		$ionicPlatform.ready(function() {

			$ionicAnalytics.register();

			if (window.cordova && window.cordova.plugins.Keyboard) {
				//Lets hide the accessory bar fo the keyboard (ios)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				// also, lets disable the native overflow scroll
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}

			$ionicPlatform.on('resume', function() {
				$state.go($state.current, {}, {
					reload: true
				});
			});

			function checkSession() {

				var sessionToken = $localStorage.get('sessionToken');
				if (sessionToken) {
					UIService.showToast({
						msg: 'attempting auto login...'
					});

					AuthService.getCurrentUser(sessionToken)
						.then(function(response) {
								UIService.hideToast();
								// user has valid session token - proceed
								$state.go('app.beacons');
							},
							function(error) {
								UIService.hideToast();
								// user needs to login
							})
				}
			}

			checkSession();
			// Initialize Parse
			Parse.initialize(appConfig.parseAppKey, appConfig.parseJSKey);
		})
	}
})();
