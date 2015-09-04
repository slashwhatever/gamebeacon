angular.module('gamebeacon.beacon.list.controllers', ['gamebeacon.services', 'gamebeacon.config'])

.factory('listControllerInitialData', [
	'Mission',
	'Level',
	'CheckPoint',
	'Platform',
	'Region',
	'Mic',
	'ObjectService',
	'$q',
	'$ionicLoading',
	function(Mission, Level, CheckPoint, Platform, Region, Mic, ObjectService, $q, $ionicLoading) {

		return function() {

			$ionicLoading.show({
				template: 'loading resources'
			});

			var missions = Mission.list(),
				levels = Level.list(),
				checkpoints = CheckPoint.list(),
				platforms = Platform.list(),
				regions = Region.list(),
				mics = Mic.list();

			return $q.all([missions, levels, checkpoints, platforms, regions, mics]).then(function(results) {
				$ionicLoading.hide();
				return {
					missions: results[0].results,
					levels: results[1].results,
					checkpoints: results[2].results,
					platforms: results[3].results,
					regions: results[4].results,
					mics: results[5].results
				};
			});
		}
	}
])

.controller('ListController', [
	'$scope',
	'$rootScope',
	'$state',
	'$ionicPopup',
	'Beacon',
	'UtilsService',
	'initialData',
	'appConfig',
	function($scope, $rootScope, $state, $ionicPopup, Beacon, UtilsService, initialData, appConfig) {

		$scope.myBeacons = [];
		$scope.beacons = [];
		$scope.skip = 0;
		$scope.limit = 20;
		$scope.moreBeacons = false;
		$scope.puserId = UtilsService.getCurrentUser().puserId

// build the basic query out
		var where = {
			'active': true,
			'startDate': {
				'$gte': {
					'__type': "Date",
					'iso': new Date(new Date().getTime()).toISOString()
				}
			}
		};

		// go grab 20 beacons from the server
		$scope.getBeaconChunk = function() {
			Beacon.list({
				limit: $scope.limit,
				skip: $scope.skip,
				'where': JSON.stringify(where)
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
			// we need to reset the skip here as we're resetting the list
			$scope.skip = 0;

			Beacon.list({
				limit: $scope.limit,
				skip: $scope.skip,
				'where': JSON.stringify(where)
			}).then(function(response) {

				$scope.beacons = response.results.length > 0 ? response.results : null;

				$scope.$broadcast('scroll.refreshComplete');
			});
		}

		$scope.joinBeacon = function(beacon) {
			Beacon.updateFireteam(beacon, 'join').then(function() {
				$scope.myBeacons.push(beacon.objectId);
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
						$scope.myBeacons = _.without($scope.myBeacons, beacon.beaconId);			// this should remove the beacon from the array
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
				$scope.myBeacons = _.without($scope.myBeacons, beacon.beaconId);			// this should remove the beacon from the array
				$state.go('app.beacons', null, {
					reload: true,
					notify: true
				});
			});
		}

		$scope.getBeaconChunk();

		// watches

		$scope.$watch('beacons', function(newVal, oldVal) {
			if (newVal && $scope.beacons.length > 0 ) {
				$scope.myBeacons.push(UtilsService.findMyBeacon($scope.beacons).objectId);
			}
		});

		// when myBeacons changes, update the currentUser
		$scope.$watch('myBeacons', function(newVal, oldVal) {
			if (newVal && $scope.beacons.length > 0 ) {
				UtilsService.getCurrentUser().myBeacons.push(UtilsService.findMyBeacon($scope.beacons).objectId);
			}
		});

	}
])
