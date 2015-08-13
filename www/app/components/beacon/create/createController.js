angular.module('destinybuddy.beacon.create.controllers', ['destinybuddy.services'])

.controller('CreateController', ['$scope', '$rootScope', '$state', 'Beacon', 'UtilsService', '$ionicSlideBoxDelegate', '$timeout', function($scope, $rootScope, $state, Beacon, UtilsService, $ionicSlideBoxDelegate, $timeout) {

	// Called when the form is submitted
	$scope.createBeacon = function() {
		var hasLevel = $scope.levels ? $scope.levels.length > 0 : false,
			hasCheckpoint = $scope.checkpoints ? $scope.checkpoints.length > 0 : false;

		Beacon.save({
			'mission': UtilsService.getObjectAsPointer('missions', $scope.missions[$ionicSlideBoxDelegate.$getByHandle('mission-selector').currentIndex()].objectId),
			'checkpoint': hasCheckpoint ? UtilsService.getObjectAsPointer('checkpoints', $scope.checkpoints[$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').currentIndex()].objectId) : null,
			'mic': UtilsService.getObjectAsPointer('mics', $scope.mics[$ionicSlideBoxDelegate.$getByHandle('mic-selector').currentIndex()].objectId),
			'level': hasLevel ? UtilsService.getObjectAsPointer('levels', $scope.levels[$ionicSlideBoxDelegate.$getByHandle('level-selector').currentIndex()].objectId) : null,
			'fireteamRequired': $ionicSlideBoxDelegate.$getByHandle('fireteam-selector').currentIndex() + 1,
			'fireteamOnboard': [UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.puserId)],
			'platform': UtilsService.getObjectAsPointer('platforms', $scope.platforms[$ionicSlideBoxDelegate.$getByHandle('platform-selector').currentIndex()].objectId),
			'region': UtilsService.getObjectAsPointer('regions', $scope.regions[$ionicSlideBoxDelegate.$getByHandle('region-selector').currentIndex()].objectId),
			'creator': UtilsService.getObjectAsPointer('pusers', $rootScope.currentUser.puserId),
			'active': true
		}).then(function(response) {
			$state.go('app.beacons', null, {
				reload: true,
				notify: true
			});
		})
	};

	$scope.$watch('levels', function() {
		$ionicSlideBoxDelegate.$getByHandle('level-selector').slide(0, 100);
		$ionicSlideBoxDelegate.$getByHandle('level-selector').update();
	});

	$scope.$watch('checkpoints', function() {
		$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').slide(0, 100);
		$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').update();
	});

	$scope.$watch('maxFireteam', function() {
		$ionicSlideBoxDelegate.$getByHandle('fireteam-selector').slide(0, 100);
		$ionicSlideBoxDelegate.$getByHandle('fireteam-selector').update();
	});

	$scope.updateMission = function(index) {
		var mission = $scope.missions[$ionicSlideBoxDelegate.$getByHandle('mission-selector').currentIndex()]
		var levels = mission.levels;
		var checkpoints = mission.checkpoints;
		$scope.levels = levels ? levels : [];
		$scope.checkpoints = checkpoints ? checkpoints : [];
		$scope.maxFireteam = $scope.getMaxFireTeam(mission)
	}

	$scope.getMaxFireTeam = function(mission) {
		return _.range(1, mission.maxFireteam)
	}


	// define all the starting variables for the view
	$scope.missions = $rootScope.missions;
	$scope.platforms = $rootScope.platforms;
	$scope.regions = $rootScope.regions;
	$scope.checkpoints = $rootScope.missions[0].checkpoints ? $rootScope.missions[0].checkpoints : null;
	$scope.mics = $rootScope.mics;
	$scope.levels = $rootScope.missions[0].levels ? $rootScope.missions[0].levels : null;
	$scope.maxFireteam = $scope.getMaxFireTeam($rootScope.missions[0]);

	// set the starting slides for the platform and region
	$scope.defaultPlatform = _.findIndex($scope.platforms, {
		objectId: $rootScope.currentUser.platform.objectId
	})
	$scope.defaultRegion = _.findIndex($scope.regions, {
		objectId: $rootScope.currentUser.region.objectId
	})

	$ionicSlideBoxDelegate.update();

}])