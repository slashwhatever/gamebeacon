var AUTH0_CLIENT_ID = 'F0fFsJbmEnKjILhv30pu2muB3TZFmaI7';
var AUTH0_DOMAIN = 'slashwhatever.auth0.com';
var AUTH0_CALLBACK_URL = location.href;
var PROXY_ADDRESS = 'http://0.0.0.0:58086'


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'destinybuddy' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'destinybuddy.controllers' is found in controllers.js
var DestinyBuddy = angular.module('destinybuddy', [
  'ionic','ionic.service.core','ionic.service.deploy','ionic.service.push','ngCordova',
  'destinybuddy.controllers',
  'destinybuddy.user.register.controllers',
  'destinybuddy.beacon.list.controllers',
  'destinybuddy.beacon.detail.controllers',
  'destinybuddy.beacon.create.controllers',
  'destinybuddy.tutorial.controllers',
  'destinybuddy.user.login.controllers',
  'destinybuddy.user.profile.controllers',
  'destinybuddy.services',
  'destinybuddy.directives',
  'destinybuddy.beacontabset.directives',
  'destinybuddy.beaconheader.directives',
  'destinybuddy.beacontimer.directives',
  'destinybuddy.fireteam.directives',
  'destinybuddy.beaconchat.directives',
  'destinybuddy.beaconmeta.directives',
  'destinybuddy.beaconactions.directives',
  'angularMoment',
  'ng-mfb'
])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {

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

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

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
        controller: 'ListController'
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
          beacon: function ($stateParams, Beacon) {
            return Beacon.get($stateParams.beaconId)
          },
          messages: function ($stateParams, MessagesService) {
            return MessagesService.list($stateParams.beaconId)
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
      missions: function (ObjectService) {
        return ObjectService.list('missions')
      },
      platforms: function (ObjectService) {
        return ObjectService.list('platforms')
      },
      regions: function (ObjectService) {
        return ObjectService.list('regions')
      },
      mics: function (ObjectService) {
        return ObjectService.list('mics')
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
        	platforms: function (ObjectService) {
        	  return ObjectService.list('platforms')
        	},
          regions: function (ObjectService) {
            return ObjectService.list('regions')
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
    	platforms: function (ObjectService) {
    	  return ObjectService.list('platforms')
    	},
      regions: function (ObjectService) {
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
