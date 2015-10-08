(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.controller('UserProfile', UserProfile);

	UserProfile.$inject = ['$rootScope', '$scope', '$state', '$cordovaImagePicker', 'initialData', 'UtilsService', 'AuthService', 'PUserService', 'UIService'];

	function UserProfile($rootScope, $scope, $state, $cordovaImagePicker, initialData, UtilsService, AuthService, PUserService, UIService) {


		// these should now be available everywhere
		$scope.platforms = initialData.platforms;
		$scope.regions = initialData.regions;
		$scope.mics = initialData.mics;
		$scope.requestPasswordReset = requestPasswordReset;
		$scope.updateProfile = updateProfile;
		$scope.currentUser = UtilsService.getCurrentUser();

// TODO: password reset broken - not passing in email


		$scope.profile = {
			'gamertag': $scope.currentUser.gamertag,
			'platform': $scope.currentUser.platform,
			'region': $scope.currentUser.region,
			//'picture': currentUser.picture,
			'mic': $scope.currentUser.mic.description == 'Mic required'
		}

		function requestPasswordReset(user) {
			UIService.showToast({
				msg: 'requesting reset...'
			});

			AuthService.requestPasswordReset(user.email)
				.then(function(response) {
					if (response && response.$resolved) {
						UIService.showAlert({
							title: 'Done!',
							template: 'We have emailed you details of how to reset your password.'
						})
					} else {
						UIService.showAlert({
							title: 'Oops!',
							template: 'Something went wrong. Try again.'
						})
					}
				}, function(error) {
					UIService.showAlert({
						title: 'Oops!',
						template: 'Something went wrong. Try again.'
					})
				})
		};

		function updateProfile(profile) {
			UIService.showToast({
				msg: 'updating profile...'
			});

			PUserService.update({
				id: $scope.currentUser.puserId
			}, {
				//picture: UtilsService.getObjectAsFile($scope.profile.picture),
				gamertag: $scope.profile.gamertag,
				platform: UtilsService.getObjectAsPointer('platforms', $scope.profile.platform.objectId),
				region: UtilsService.getObjectAsPointer('regions', $scope.profile.region.objectId),
				mic: UtilsService.getObjectAsPointer('mics', _.findWhere($scope.mics, {
					description: $scope.profile.mic ? 'Mic required' : 'Mic optional'
				}).objectId)
			}).then(function(response) {
				if (response && response.$resolved) {
					UIService.showAlert({
						title: 'Yesss!',
						template: 'You updated your profile'
					}, function() {
						$state.go('app.beacons')
					})
				} else {
					UIService.showAlert({
						title: 'Oops!',
						template: 'Looks like there was a problem updating those details. Try again.'
					})
				}
			}, function(error) {
				UIService.showAlert({
					title: 'Oops!',
					template: error.message
				})
			})
		};

	}
})();