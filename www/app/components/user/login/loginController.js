angular.module('gamebeacon.user.login.controllers', ['gamebeacon.services'])

.controller('LoginController', [
	'$rootScope',
	'$scope',
	'$state',
	'$ionicUser',
	'UIService',
	'AuthService',
	'PushService',
	function($rootScope, $scope, $state, $ionicUser, UIService, AuthService, PushService) {

		$scope.user = {
			username: '',
			password: ''
		};

		$scope.login = function(form) {

			AuthService.login($scope.user).then(function(response) {

				$ionicUser.identify({
					user_id: response.puserId,
					username: response.username
				});

				if (window.plugins) PushService.registerPush(response.puserId)

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
