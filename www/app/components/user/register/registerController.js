angular.module('destinybuddy.user.register.controllers', ['destinybuddy.services'])


.controller('RegisterController', ['$rootScope', '$scope', '$state', 'platforms', 'regions', 'AuthService', 'UIService', 'UtilsService', function($rootScope, $scope, $state, platforms, regions, AuthService, UIService, UtilsService) {

	$scope.platforms = platforms.results;
	$scope.regions = regions.results;

	$scope.user = {
		username: '',
		email: '',
		password: '',
		gamertag: '',
		platform: '',
		region: ''
	};

	$scope.register = function( form ) {
		if(form.$valid) {
		AuthService.signup($scope.user)
			.then(function(response) {
				if (response && response.$resolved) {
					UIService.showAlert({
						title: 'Success!',
						template: 'Now we need you to go click the confirmation link in the email we just sent you....please :)'
					}, function() {
						$state.go('login')
					})
				} else {
					UIService.showAlert({
						title: 'Oops!',
						template: 'Looks like there was a problem signing you up. Try again.'
					})
				}
			}, function(error) {
				UIService.showAlert({
					title: 'Oops!',
					template: error.data.error
				})
			})
		} else {
			UIService.showAlert({
				title: 'Oops!',
				template: 'Please make sure all fields are complete.'
			})
		}
	};

}])