(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.controller('Register', Register);

	Register.$inject = ['$rootScope', '$scope', '$state', 'platforms', 'regions', 'mics', 'AuthService', 'UIService', 'UtilsService'];

	function Register($rootScope, $scope, $state, platforms, regions, mics, AuthService, UIService, UtilsService) {

		$scope.platforms = platforms.results;
		$scope.regions = regions.results;
		$scope.mics = mics.results;

		$scope.user = {
			username: '',
			email: '',
			password: '',
			gamertag: '',
			platform: '',
			region: '',
			mic: ''
		};

		$scope.register = function(form) {
			if (form.$valid) {

				UIService.showToast({
					msg: 'registering user...'
				});

				AuthService.signup({
						username: $scope.user.username,
						gamertag: $scope.user.gamertag,
						email: $scope.user.email,
						password: $scope.user.password,
						platform: UtilsService.getObjectAsPointer('platforms', $scope.user.platform.objectId),
						region: UtilsService.getObjectAsPointer('regions', $scope.user.region.objectId),
						mic: UtilsService.getObjectAsPointer('mics', _.findWhere($scope.mics, {
							description: $scope.user.mic ? 'Mic required' : 'Mic optional'
						}).objectId)
					})
					.then(function(response) {
						if (response && response.$resolved) {
							UIService.showAlert({
								title: 'Success!',
								template: 'Confirm your account by clicking the link in the email we just sent you...please :)'
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

	}
})();
