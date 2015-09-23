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
			$scope.checkSession();
		});

		$scope.checkSession = function() {

			var sessionToken = $localStorage.get('sessionToken');
			if ( sessionToken ){
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

		$scope.login = function(form) {

			UIService.showToast({
				msg: 'checking credentials...'
			});

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

				UIService.hideToast();

				$state.go('app.beacons');

			}, function(error) {
				UIService.showAlert({
					title: 'Oops!',
					template: 'We had trouble logging you in. Please try again.'
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
