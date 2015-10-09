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

		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js
		$stateProvider

			.state('login', {
			url: '/login',
			templateUrl: 'app/login/login.html',
			controller: 'Login',
			data: {
				requireLogin: false
			}
		})

		.state('app', {
			url: '/app',
			templateUrl: 'app/shared/mainView.html',
			abstract: true,
			data: {
				requireLogin: true
			}
		})

		.state('app.beacons', {
			url: '/beacons',
			views: {
				'main-view': {
					templateUrl: 'app/components/beacon/list/listView.html',
					controller: 'ListController',
					resolve: {
						initialData: function(listControllerInitialData) {
							return listControllerInitialData()
						}
					}
				}
			}
		})

		.state('app.beacon', {
			url: '/beacons/:beaconId',
			views: {
				'main-view': {
					templateUrl: 'app/components/beacon/detail/detailView.html',
					controller: 'DetailController',
					resolve: {
						beaconDetails: function($stateParams, beaconDetailData) {
							return beaconDetailData($stateParams.beaconId)
						}
					}
				}
			}
		})


		.state('beacon-create', {
			url: '/beacon-create',
			templateUrl: 'app/components/beacon/create/createView.html',
			controller: 'CreateController',
			resolve: {
				initialData: function(listControllerInitialData) {
					return listControllerInitialData()
				}
			}
		})

		.state('app.profile', {
			url: '/profile',
			views: {
				'main-view': {
					templateUrl: 'app/user/profile/profile.html',
					controller: 'UserProfile',
					resolve: {
						initialData: function(listControllerInitialData) {
							return listControllerInitialData()
						}
					}
				}
			}
		})

		.state('app.about', {
			url: '/about',
			views: {
				'main-view': {
					templateUrl: 'app/about/about.html'
				}
			}
		})

		.state('signup', {
			url: '/register',
			templateUrl: 'app/user/register/register.html',
			controller: 'RegisterController',
			resolve: {
				platforms: function(Resource) {
					return Resource.list('platforms')
				},
				regions: function(Resource) {
					return Resource.list('regions')
				},
				mics: function(Resource) {
					return Resource.list('mics')
				}
			}
		})

		.state('reset-password', {
			url: '/reset-password',
			templateUrl: 'app/user/reset/resetpassword.html',
			controller: 'Reset'
		})

		.state('tutorial', {
			url: '/',
			templateUrl: 'app/tutorial/tutorial.html',
			controller: 'Tutorial'
		})

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/login');
		$urlRouterProvider.when('', '/login');

	}

})();