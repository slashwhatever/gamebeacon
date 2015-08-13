angular.module('destinybuddy.beacon.list.controllers', ['destinybuddy.services'])

.controller('ListController', ['$scope', '$rootScope', '$state', '$ionicPopup', 'Beacon', 'UtilsService', 'missions', 'platforms', 'checkpoints', 'regions','levels', 'mics', function($scope, $rootScope, $state, $ionicPopup, Beacon, UtilsService, missions, platforms, checkpoints, regions, levels, mics ) {

	$scope.myBeacon = null;
	$scope.beacons = [];
	$scope.skip = 0;
	$scope.limit = 20;
	$scope.moreBeacons = false;
	$scope.floatButton = {
		label: $scope.myBeacon ? 'Create beacon' : 'My beacon',
		icon: $scope.myBeacon ? 'ion-compose' : 'ion-radio-waves',
	}

	// these should now be available everywhere
	$rootScope.missions = missions.results;
	$rootScope.platforms = platforms.results;
	$rootScope.regions = regions.results;
	$rootScope.checkpoints = checkpoints.results;
	$rootScope.levels = levels.results;
	$rootScope.mics = levels.mics;

	// go grab 20 beacons from the server
	$scope.getBeaconChunk = function() {
		Beacon.list({
			limit: $scope.limit,
			skip: $scope.skip
		}).then(function(response) {

			// if we have results, there may be more...
			$scope.moreBeacons = (response.results.length > $scope.limit)

			// increment the skip counter
			$scope.skip += Math.min(response.results.length, $scope.limit);

			// add the results to the scope
			if (response.results.length > 0) $scope.beacons = $scope.beacons.concat(response.results);
			else $scope.beacons = null;

			// call a stop to the infinite scroll
			$scope.$broadcast('scroll.infiniteScrollComplete');

		});
	}

	$scope.refreshBeaconList = function() {
		Beacon.list().then(function(response) {

			// we need to reset the skip here as we're resetting the list
			$scope.skip = 0;

			$scope.beacons = response.results.length > 0 ? response.results : null;

			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.joinBeacon = function(beacon) {
		Beacon.updateFireteam(beacon, 'join').then(function() {
			$scope.myBeacon = beacon.objectId;
			$state.go('app.beacon', {
				beaconId: beacon.objectId
			}, {
				reload: true,
				notify: true
			});
		});
	}

	$scope.deleteBeacon = function(beacon) {
		var confirmDel = $ionicPopup.confirm({
			title: 'Delete beacon',
			template: 'Are you sure you want to delete your beacon?'
		});
		confirmDel.then(function(res) {
			if (res) {
				Beacon.delete(beacon).then(function() {
					$scope.myBeacon = null;
					$state.go('app.beacons', null, {
						reload: true,
						notify: true
					});
				});
			}
		});
	}

	$scope.leaveBeacon = function(beacon) {
		Beacon.updateFireteam(beacon, 'leave').then(function() {
			$scope.myBeacon = null;
			$state.go('app.beacons', null, {
				reload: true,
				notify: true
			});
		});
	}

	$scope.getBeaconChunk();

	// watches

	$scope.$watch('beacons', function() {
		$scope.myBeacon = UtilsService.findMyBeacon($scope.beacons);
	});

	// when myBeacon changes, update the currentUser being held on $rootScope
	$scope.$watch('myBeacon', function() {
		$rootScope.currentUser.myBeacon = $scope.myBeacon;
	});

}])
