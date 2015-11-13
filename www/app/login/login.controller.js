(function() {
	'use strict';
	angular
		.module('gamebeacon.login')
		.controller('LoginController', LoginController);
	LoginController.$inject = ['$ionicPlatform', '$scope', '$state', '$ionicUser', '$localStorage', 'UI', 'Auth', 'Push', 'Update', 'PUser'];

	function LoginController($ionicPlatform, $scope, $state, $ionicUser, $localStorage, UI, Auth, Push, Update, PUser) {
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
					.then(afterLogin,
						function(error) {
							UI.hideToast();
							// user needs to login
						})
			}
		}

		function afterLogin(authUser) {
			var user = $ionicUser.get();
			if (!user.installationId) {
				user.installationId = $ionicUser.generateGUID();
			}
			_.extend(user, {
				gamertag: authUser.gamertag,
				user_id: authUser.puserId,
				username: authUser.username
			});
			$ionicUser.identify(user);

			$ionicPlatform.ready(function() {

				if (window && window.device && PushNotification) {
					Push.registerPush(user);
				}

			});

			UI.hideToast();
			Update.checkForUpdates();
			$state.go('app.beacons');
		}

		function login(form) {
			UI.showToast({
				msg: 'checking credentials...'
			});
			Auth.login($scope.user)
				.then(afterLogin, function(error) {
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
