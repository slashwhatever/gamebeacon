(function() {
	'use strict';

	angular
		.module('gamebeacon.user')
		.controller('UserProfile', UserProfile);

	UserProfile.$inject = ['$rootScope', '$scope', '$state', '$cordovaImagePicker', 'initialData', 'Utils', 'Auth', 'PUser', 'UI'];

	function UserProfile($rootScope, $scope, $state, $cordovaImagePicker, initialData, Utils, Auth, PUser, UI) {


		// these should now be available everywhere
		$scope.platforms = initialData.platforms;
		$scope.regions = initialData.regions;
		$scope.mics = initialData.mics;
		$scope.requestPasswordReset = requestPasswordReset;
		$scope.updateProfile = updateProfile;
		$scope.currentUser = Utils.getCurrentUser();

// TODO: password reset broken - not passing in email


		$scope.profile = {
			'gamertag': $scope.currentUser.gamertag,
			'platform': $scope.currentUser.platform,
			'region': $scope.currentUser.region,
			//'picture': currentUser.picture,
			'mic': $scope.currentUser.mic.description == 'Mic required'
		}

		function requestPasswordReset(user) {
			UI.showToast({
				msg: 'requesting reset...'
			});

			Auth.requestPasswordReset(user.email)
				.then(function(response) {
					if (response && response.$resolved) {
						UI.showAlert({
							title: 'Done!',
							template: 'We have emailed you details of how to reset your password.'
						})
					} else {
						UI.showAlert({
							title: 'Oops!',
							template: 'Something went wrong. Try again.'
						})
					}
				}, function(error) {
					UI.showAlert({
						title: 'Oops!',
						template: 'Something went wrong. Try again.'
					})
				})
		};

		function updateProfile(profile) {
			UI.showToast({
				msg: 'updating profile...'
			});

			PUser.update({
				id: $scope.currentUser.puserId
			}, {
				//picture: Utils.getObjectAsFile($scope.profile.picture),
				gamertag: $scope.profile.gamertag,
				platform: Utils.getObjectAsPointer('platforms', $scope.profile.platform.objectId),
				region: Utils.getObjectAsPointer('regions', $scope.profile.region.objectId),
				mic: Utils.getObjectAsPointer('mics', _.findWhere($scope.mics, {
					description: $scope.profile.mic ? 'Mic required' : 'Mic optional'
				}).objectId)
			}).then(function(response) {
				if (response && response.$resolved) {
					UI.showAlert({
						title: 'Yesss!',
						template: 'You updated your profile'
					}, function() {
						$state.go('app.beacons')
					})
				} else {
					UI.showAlert({
						title: 'Oops!',
						template: 'Looks like there was a problem updating those details. Try again.'
					})
				}
			}, function(error) {
				UI.showAlert({
					title: 'Oops!',
					template: error.message
				})
			})
		};

	}
})();