angular.module('destinybuddy.user.login.controllers', ['destinybuddy.services'])

.controller('LoginController', ['$rootScope', '$scope', '$state', '$ionicUser', '$ionicPush', 'AuthService', function($rootScope, $scope, $state, $ionicUser, $ionicPush, AuthService) {

	$scope.user = {
		username: '',
		password: ''
	};

	$scope.login = function(form) {
		AuthService.login($scope.user).then(function(response) {

			// register device for push
			$ionicPush.register({
				canShowAlert: false,
				canSetBadge: true,
				canPlaySound: true,
				canRunActionsOnWake: true,
				onNotification: function(notification) {
					alert(JSON.stringify(notification));
					return true;
				}
			}, {
				user_id: response.puserId
			});

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

	// Handles incoming device tokens
	$rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
		console.log('Ionic Push: Got token ', data.token, data.platform);
		$scope.token = data.token;
	});

}])
