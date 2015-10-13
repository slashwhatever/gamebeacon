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
					templateUrl: 'app/layout/main.html',
					abstract: true,
					data: {
						requireLogin: true
					}
				})

				.state('app.beacons', {
					url: '/beacons',
					views: {
						'main-view': {
							templateUrl: '/app/beacon/list/list.html',
							controller: 'List',
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
							templateUrl: 'app/beacon/show/show.html',
							controller: 'Show',
							resolve: {
								beaconDetails: function($stateParams, beaconDetailData) {
									return beaconDetailData($stateParams.beaconId)
								}
							}
						}
					}
				})

				.state('app.dashboard', {
					url: '/dashboard/:puserId',
					views: {
						'main-view': {
							templateUrl: 'app/dashboard/dashboard.html',
							controller: 'Dashboard'
						}
					}
				})

				.state('beacon-create', {
					url: '/beacon-create',
					templateUrl: 'app/beacon/create/create.html',
					controller: 'Create',
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
							controller: 'Profile',
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
					controller: 'Register',
					resolve: {
						platforms: function(ObjectService) {
							return ObjectService.list('platforms')
						},
						regions: function(ObjectService) {
							return ObjectService.list('regions')
						},
						mics: function(ObjectService) {
							return ObjectService.list('mics')
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
