angular.module('gamebeacon.user.dashboard.controllers', ['gamebeacon.services'])

.controller('DashboardController', [
	'$rootScope',
	'$scope',
	'$state',
	'$ionicUser',
	'$stateParams',
	'UtilsService',
	'UIService',
	'Beacon',
	'PushService',
	function($rootScope, $scope, $state, $ionicUser, $stateParams, UtilsService, UIService, Beacon, PushService) {

		$scope.myBeacons = [];
		$scope.beacons = [];
		$scope.skip = 0;
		$scope.limit = 20;
		$scope.moreBeacons = false;
		$scope.currentUser = UtilsService.getCurrentUser()

		$scope.$on('$ionicView.beforeEnter', function(){
		  $scope.getBeaconChunk();
		});

		// build the basic query out
		var where = {
			'active': true,
			'creator': UtilsService.getObjectAsPointer('pusers', $stateParams.puserId),
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

	}
])
