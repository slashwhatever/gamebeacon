(function() {
	'use strict';

	angular
		.module('gamebeacon.login')
		.controller('Login', Login);

	Login.$inject = ['$rootScope', '$scope', '$state', '$ionicUser', '$localStorage', 'UIService', 'AuthService', 'PushService', 'UpdateService'];

	function Login($rootScope, $scope, $state, $ionicUser, $localStorage, UIService, AuthService, PushService, UpdateService) {

		var me = this;

		$scope.user = {
			username: '',
			password: ''
		};

		$scope.checkS

		$scope.$on('$ionicView.beforeEnter', checkSession);

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
							UpdateService.checkForUpdates();
						},
						function(error) {
							UIService.hideToast();
							// user needs to login
						})
			}
		}

		function login(form) {

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

		function logout(form) {
			$rootScope.currentUser = null
			$state.go('login');
		}

		function requestPasswordReset(form) {
			$rootScope.currentUser = null
			$state.go('reset-password');
		}
	}
})();
