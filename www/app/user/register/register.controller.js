(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.controller('RegisterController', RegisterController);

	RegisterController.$inject = ['$rootScope', '$scope', '$state', 'platforms', 'regions', 'mics', 'Auth', 'UI', 'Utils'];

	function RegisterController($rootScope, $scope, $state, platforms, regions, mics, Auth, UI, Utils) {

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

				UI.showToast({
					msg: 'registering user...'
				});

				Auth.signup({
						username: $scope.user.username,
						gamertag: $scope.user.gamertag,
						email: $scope.user.email,
						password: $scope.user.password,
						platform: Utils.getObjectAsPointer('platforms', $scope.user.platform.objectId),
						region: Utils.getObjectAsPointer('regions', $scope.user.region.objectId),
						mic: Utils.getObjectAsPointer('mics', _.findWhere($scope.mics, {
							description: $scope.user.mic ? 'Mic required' : 'Mic optional'
						}).objectId)
					})
					.then(function(response) {
						if (response && response.$resolved) {
							UI.showAlert({
								title: 'Success!',
								template: 'Confirm your account by clicking the link in the email we just sent you...please :)'
							}, function() {
								$state.go('login')
							})
						} else {
							UI.showAlert({
								title: 'Oops!',
								template: 'Looks like there was a problem signing you up. Try again.'
							})
						}
					}, function(error) {
						UI.showAlert({
							title: 'Oops!',
							template: error.data.error
						})
					})
			} else {
				UI.showAlert({
					title: 'Oops!',
					template: 'Please make sure all fields are complete.'
				})
			}
		};

	}
})();
