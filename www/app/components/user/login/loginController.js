angular.module('destinybuddy.user.login.controllers', ['destinybuddy.services'])

.controller('LoginController', ['$rootScope', '$scope', '$state', '$ionicPush','AuthService', function($rootScope, $scope, $state, $ionicPush, AuthService) {

	$scope.user = {
		username: '',
		password: ''
	};

	$scope.login = function(form) {
		AuthService.login($scope.user).then(function(response) {
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
		//alert("Successfully registered token " + data.token);
		//console.log('Ionic Push: Got token ', data.token, data.platform);
		$scope.token = data.token;
	});

	// Identifies a user with the Ionic User service
	$scope.identifyUser = function() {
		//console.log('Ionic User: Identifying with Ionic User service');

		var user = $ionicUser.get();
		if (!user.user_id) {
			// Set your user_id here, or generate a random one.
			user.user_id = $ionicUser.generateGUID();
		};

		// Identify your user with the Ionic User Service
		$ionicUser.identify(user).then(function() {
			$scope.identified = true;
			//alert('Identified user ' + user.name + '\n ID ' + user.user_id);
		});
	};

	// Registers a device for push notifications and stores its token
	$scope.pushRegister = function() {
		//console.log('Ionic Push: Registering user');

		// Register with the Ionic Push service.  All parameters are optional.
		$ionicPush.register({
			canShowAlert: true, //Can pushes show an alert on your screen?
			canSetBadge: true, //Can pushes update app icon badges?
			canPlaySound: true, //Can notifications play a sound?
			canRunActionsOnWake: true, //Can run actions outside the app,
			onNotification: function(notification) {
				// Handle new push notifications here
				// console.log(notification);
				return true;
			}
		});
	};

	$scope.pushRegister();

}])
