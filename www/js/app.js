// angular.module is a global place for creating, registering and retrieving Angular modules
// 'gamebeacon' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'gamebeacon.controllers' is found in controllers.js
//


var GameBeacon = angular.module('gamebeacon', [
	'ionic', 'ionic.service.core', 'ionic.service.analytics', 'ionic.service.deploy', 'ionic.service.push', 'ngCordova',
	'gamebeacon.user.register.controllers',
	'gamebeacon.user.reset.controllers',
	'gamebeacon.user.login.controllers',
	'gamebeacon.user.profile.controllers',
	'gamebeacon.user.reset.controllers',
	'gamebeacon.user.dashboard.controllers',
	'gamebeacon.beacon.list.controllers',
	'gamebeacon.beacon.detail.controllers',
	'gamebeacon.beacon.create.controllers',
	'gamebeacon.beacon.tabset.directives',
	'gamebeacon.beacon.header.directives',
	'gamebeacon.beacon.timer.directives',
	'gamebeacon.beacon.chat.directives',
	'gamebeacon.beacon.meta.directives',
	'gamebeacon.beacon.actions.directives',
	'gamebeacon.tutorial.controllers',
	'gamebeacon.services',
	'gamebeacon.user.services',
	'gamebeacon.puser.services',
	'gamebeacon.chat.services',
	'gamebeacon.shared.directives',
	'gamebeacon.fireteam.directives',
	'gamebeacon.beacon.scheduler.directives',
	'gamebeacon.beacon.register.directives',
	'templates',
	'angularMoment',
	'ng-mfb'
])

.run(function($state, $ionicPlatform, $ionicAnalytics, appConfig) {
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

	});

	// Initialize Parse
	Parse.initialize(appConfig.parseAppKey, appConfig.parseJSKey);

})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $ionicAppProvider, $logProvider, $compileProvider, appConfig) {

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
		templateUrl: 'app/components/user/login/loginView.html',
		controller: 'LoginController',
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
					beacon: function($stateParams, Beacon) {
						return Beacon.get($stateParams.beaconId)
					},
					messages: function($stateParams, ChatService) {
						return ChatService.list($stateParams.beaconId)
					}
				}
			}
		}
	})

	.state('app.dashboard', {
		url: '/dashboard/:puserId',
		views: {
			'main-view': {
				templateUrl: 'app/components/user/dashboard/dashboardView.html',
				controller: 'DashboardController'
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
				templateUrl: 'app/components/user/profile/profileView.html',
				controller: 'ProfileController',
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
				templateUrl: 'app/components/about/aboutView.html'
			}
		}
	})

	.state('signup', {
		url: '/register',
		templateUrl: 'app/components/user/register/registerView.html',
		controller: 'RegisterController',
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
		templateUrl: 'app/components/user/reset/resetPasswordView.html',
		controller: 'ResetController'
	})

/*	.state('app.donate', {
		url: '/donate',
		views: {
			'main-view': {
				templateUrl: 'app/components/donate/donateView.html'
			}
		}
	})
*/
	.state('tutorial', {
		url: '/',
		templateUrl: 'app/components/tutorial/tutorialView.html',
		controller: 'TutorialController'
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/login');
	$urlRouterProvider.when('', '/login');

});
