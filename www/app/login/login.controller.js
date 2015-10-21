(function() {
	'use strict';

	angular
		.module('gamebeacon.login')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$scope', '$state', '$ionicUser', '$localStorage', 'UI', 'Auth', 'Push', 'Update', 'PUser'];

	function LoginController($scope, $state, $ionicUser, $localStorage, UI, Auth, Push, Update, PUser) {

		var me = this;

		$scope.user = {
			username: '',
			password: ''
		};

		$scope.login = login;

		$scope.$on('$ionicView.beforeEnter', checkSession);

		function checkSession() {

			var sessionToken = $localStorage.get('sessionToken');
			if (sessionToken) {
				UI.showToast({
					msg: 'attempting auto login...'
				});

				Auth.getCurrentUser(sessionToken)
					.then(function(response) {
							UI.hideToast();
							// user has valid session token - proceed
							$state.go('app.beacons');
							Update.checkForUpdates();
						},
						function(error) {
							UI.hideToast();
							// user needs to login
						})
			}
		}

		function login(form) {

			UI.showToast({
				msg: 'checking credentials...'
			});

			Auth.login($scope.user).then(function(response) {

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

				if (window.plugins) Push.registerPush(user)

				UI.hideToast();

				$state.go('app.beacons');

			}, function(error) {
				UI.showAlert({
					title: 'Oops!',
					template: 'We had trouble logging you in. Please try again.'
				})
			})

		}

		function logout(form) {
			PUser.setCurrentUser(null);
			$state.go('login');
		}

		function requestPasswordReset(form) {
			PUser.setCurrentUser(null);
			$state.go('reset-password');
		}
	}
})();
