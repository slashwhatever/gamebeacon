angular.module('gamebeacon.beacon.list.controllers', ['gamebeacon.services', 'gamebeacon.config'])

.factory('listControllerInitialData', ['ObjectService', '$q', function(ObjectService, $q) {
	return function() {
		var missions = ObjectService.list('missions', {
				params: {
					'order': 'order',
					'include': 'levels,checkpoints'
				}
			}),
			levels = ObjectService.list('levels'),
			checkpoints = ObjectService.list('checkpoints', {
				params: {
					'order': 'order'
				}
			}),
			platforms = ObjectService.list('platforms'),
			regions = ObjectService.list('regions'),
			mics = ObjectService.list('mics');

		return $q.all([missions, levels, checkpoints, platforms, regions, mics]).then(function(results) {
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
}])

.controller('ListController', [
	'$scope', '$rootScope', '$state', '$ionicPopup', 'Beacon', 'UtilsService', 'initialData', 'appConfig',
	function($scope, $rootScope, $state, $ionicPopup, Beacon, UtilsService, initialData, appConfig) {

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
		$rootScope.missions = initialData.missions;
		$rootScope.platforms = initialData.platforms;
		$rootScope.regions = initialData.regions;
		$rootScope.checkpoints = initialData.checkpoints;
		$rootScope.levels = initialData.levels;
		$rootScope.mics = initialData.mics;

		// go grab 20 beacons from the server
		$scope.getBeaconChunk = function() {
			Beacon.list({
				limit: $scope.limit,
				skip: $scope.skip,
				'where': '{"active":true,"createdAt":{"$gte":{ "__type": "Date", "iso": "' + new Date(new Date().getTime() - (appConfig.maxBeaconAge * 60000)).toISOString() + '" }}}' // only get beacons that are less than 30 mins old
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
				'where': '{"active":true, "createdAt":{"$gte":{ "__type": "Date", "iso": "' + new Date(new Date().getTime() - (appConfig.maxBeaconAge * 60000)).toISOString() + '" }}}' // only get beacons that are less than 30 mins old
			}).then(function(response) {

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

	}
])
