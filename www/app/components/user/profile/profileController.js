angular.module('gamebeacon.user.profile.controllers', ['gamebeacon.services'])

.controller('ProfileController', ['$rootScope', '$scope', '$state', 'UtilsService', 'AuthService', 'PUserService', 'UIService', function($rootScope, $scope, $state, UtilsService, AuthService, PUserService, UIService) {

	$scope.platforms = $rootScope.platforms;
	$scope.regions = $rootScope.regions;
	$scope.mics = $rootScope.mics;

	$scope.profile = {
		'gamertag': $rootScope.currentUser.gamertag,
		'platform': $rootScope.currentUser.platform,
		'region': $rootScope.currentUser.region,
		'mic': $rootScope.currentUser.mic.description == 'Mic required'
	}

	$scope.requestPasswordReset = function(user) {
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

	$scope.updateProfile = function(profile) {
		PUserService.update({
			id: $rootScope.currentUser.puserId
		}, {
			gamertag: $scope.profile.gamertag,
			platform: UtilsService.getObjectAsPointer('platforms', $scope.profile.platform.objectId),
			region: UtilsService.getObjectAsPointer('regions', $scope.profile.region.objectId),
			mic: UtilsService.getObjectAsPointer('mics', _.findWhere($scope.mics, {description : $scope.profile.mic ? 'Mic required' : 'Mic optional'}).objectId)
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


}])
