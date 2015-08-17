// angular.module is a global place for creating, registering and retrieving Angular modules
// 'destinybuddy' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'destinybuddy.controllers' is found in controllers.js
var DestinyBuddy = angular.module('destinybuddy', [
	'ionic', 'ionic.service.core', 'ionic.service.analytics', 'ionic.service.deploy', 'ionic.service.push', 'ngCordova',
	'destinybuddy.user.register.controllers',
	'destinybuddy.user.login.controllers',
	'destinybuddy.user.profile.controllers',
	'destinybuddy.beacon.list.controllers',
	'destinybuddy.beacon.detail.controllers',
	'destinybuddy.beacon.create.controllers',
	'destinybuddy.beacon.tabset.directives',
	'destinybuddy.beacon.header.directives',
	'destinybuddy.beacon.timer.directives',
	'destinybuddy.beacon.chat.directives',
	'destinybuddy.beacon.meta.directives',
	'destinybuddy.beacon.actions.directives',
	'destinybuddy.tutorial.controllers',
	'destinybuddy.services',
	'destinybuddy.user.services',
	'destinybuddy.puser.services',
	'destinybuddy.chat.services',
	'destinybuddy.shared.directives',
	'destinybuddy.fireteam.directives',
	'destinybuddy.beacon.register.directives',
	'angularMoment',
	'ng-mfb'
])

.run(function($ionicPlatform, $ionicAnalytics) {
	$ionicPlatform.ready(function() {

		$ionicAnalytics.register();

		if (window.cordova && window.cordova.plugins.Keyboard) {
			//Lets hide the accessory bar fo the keyboard (ios)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			// also, lets disable the native overflow scroll
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}

	});

	// Initialize Parse
	Parse.initialize("G6y5BCESWE0d9IP0034FRuSXtBIOCUO5vdMUfhm1", "DK9nUcIYyHQRMYg1toAX784gci4j9u23aNRacZiP");


})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

	if (ionic.Platform.isAndroid()) $ionicConfigProvider.scrolling.jsScrolling(false);

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
		templateUrl: 'templates/main.html',
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

	.state('beacon-create', {
		url: '/beacon-create',
		templateUrl: 'app/components/beacon/create/createView.html',
		controller: 'CreateController'
	})

	.state('app.profile', {
		url: '/profile',
		views: {
			'main-view': {
				templateUrl: 'app/components/user/profile/profileView.html',
				controller: 'ProfileController'
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
			}
		}
	})

	.state('app.donate', {
		url: '/donate',
		views: {
			'main-view': {
				templateUrl: 'app/components/donate/donateView.html'
			}
		}
	})

	.state('tutorial', {
		url: '/',
		templateUrl: 'app/components/tutorial/tutorialView.html',
		controller: 'TutorialController'
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/login');
	$urlRouterProvider.when('', '/login');

});
