angular.module('destinybuddy.user.profile.controllers', ['destinybuddy.services'])

.controller('ProfileController', ['$rootScope', '$scope', '$state', 'platforms', 'regions', 'UtilsService', 'AuthService', 'PUserService', 'UIService', function($rootScope, $scope, $state, platforms, regions, UtilsService, AuthService, PUserService, UIService) {

/*	$scope.platforms = platforms.results;
	$scope.regions = regions.results;
*/
	$scope.profile = $rootScope.currentUser;

	$scope.requestPasswordReset = function(user) {
		AuthService.requestPasswordReset(user)
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
			gamertag: profile.gamertag,
			platform: UtilsService.getObjectAsPointer('platforms', profile.platform.objectId),
			region: UtilsService.getObjectAsPointer('regions', profile.region.objectId)
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
						title: 'Failed!',
						template: 'Looks like there was a problem updating those details. Try again.'
					})
				}
			}, function(error) {
				UIService.showAlert({
					title: 'Failed!',
					template: error.message
				})
			})
	};


}])
