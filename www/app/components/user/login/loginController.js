angular.module('gamebeacon.user.login.controllers', ['gamebeacon.services'])

.controller('LoginController', [
	'$rootScope',
	'$scope',
	'$state',
	'$ionicUser',
	'$ionicDeploy',
	'$localStorage',
	'UtilsService',
	'UIService',
	'AuthService',
	'PushService',
	function($rootScope, $scope, $state, $ionicUser, $ionicDeploy, $localStorage, UtilsService, UIService, AuthService, PushService) {

		$scope.user = {
			username: '',
			password: ''
		};

		$scope.$on('$ionicView.beforeEnter', function () {
			$scope.checkForUpdates();
			$scope.checkSession();
		});

		$scope.checkSession = function() {
			var sessionToken = $localStorage.get('sessionToken');
			if ( sessionToken ){

				AuthService.getCurrentUser(sessionToken)
				.then(function(response) {
					// user has valid session token - proceed
					$state.go('app.beacons');
				},
					function(error) {
						// user needs to login
				})
			}
		}

	  // Update app code with new release from Ionic Deploy
	  $scope.doUpdate = function() {
	    $ionicDeploy.update().then(function(res) {
	      console.log('Ionic Deploy: Update Success! ', res);
	    }, function(err) {
	      console.log('Ionic Deploy: Update error! ', err);
	    }, function(prog) {
	      console.log('Ionic Deploy: Progress... ', prog);
	    });
	  };

	  // Check Ionic Deploy for new code
	  $scope.checkForUpdates = function() {
	    console.log('Ionic Deploy: Checking for updates');
	    $ionicDeploy.check().then(function(hasUpdate) {
	      console.log('Ionic Deploy: Update available: ' + hasUpdate);
	      $scope.hasUpdate = hasUpdate;
	    }, function(err) {
	      console.error('Ionic Deploy: Unable to check for updates', err);
	    });
	  }

		$scope.login = function(form) {

			AuthService.login($scope.user).then(function(response) {

				var user = $ionicUser.get();

				if (!user.installationId) {
					user.installationId = $ionicUser.generateGUID();
				}

				_.extend(user, {
					gamertag: response.gamertag,
					user_id: response.puserId,
					username: response.username
				});

				$ionicUser.identify(user);

				if (window.plugins) PushService.registerPush(user)

				$state.go('app.beacons');

			}, function(error) {
				UIService.showAlert({
					title: 'Oops!',
					template: error
				})
			})

		}

		$scope.logout = function(form) {
			$rootScope.currentUser = null
			$state.go('login');
		}

		$scope.requestPasswordReset = function(form) {
			$rootScope.currentUser = null
			$state.go('reset-password');
		}

	}
])
