angular.module('destinybuddy.user.login.controllers', ['destinybuddy.services'])

.controller('LoginController', ['$rootScope', '$scope', '$state', 'AuthService', function($rootScope, $scope, $state, AuthService) {

	$scope.user = {
		username: '',
		password: ''
	};

	$scope.login = function(form) {
		AuthService.login($scope.user).then(function(response) {
			$state.go('app.beacons');
		})
	}

	$scope.logout = function(form) {
		$rootScope.currentUser = null
		$state.go('login');
	}

}])