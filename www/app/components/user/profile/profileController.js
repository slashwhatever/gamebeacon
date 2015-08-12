angular.module('destinybuddy.user.profile.controllers', ['destinybuddy.services'])

.controller('ProfileController', ['$rootScope', '$scope', '$state', 'UtilsService', 'AuthService', 'PUserService', 'UIService', function($rootScope, $scope, $state, UtilsService, AuthService, PUserService, UIService) {

	$scope.profile = {
		platformIcon: UtilsService.getPlatformIcon($scope.currentUser.platform.name)
	}

	_.extend($scope.profile, $rootScope.currentUser)

	$scope.profile = {
		platformIcon: UtilsService.getPlatformIcon($scope.currentUser.platform.name)
	}

	_.extend($scope.profile, $rootScope.currentUser)

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

	$scope.updateProfile = function(user) {
		PUserService.update({
			gamertag: user.gamertag,
			id: $rootScope.currentUser.puserId
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
