(function() {
	'use strict';

	angular
		.module('gamebeacon.beacon')
		.controller('ListController', ListController);

	ListController.$inject = ['$scope', '$state', '$ionicPopup', 'UI', 'Beacon', 'Utils', 'appConfig', 'InitialData', 'PUser'];

	function ListController($scope, $state, $ionicPopup, UI, Beacon, Utils, appConfig, InitialData, PUser) {


		var today = new Date(),
			_fromDate = new Date(today.setDate(today.getDate())),
			_toDate = new Date(today.setDate(today.getDate()));

		//_fromDate.setHours(0, 0, 0);			// midnight
		_toDate.setHours(23, 59, 59); // midnight


		$scope.myBeacons = [];
		$scope.beacons = [];
		$scope.skip = 0;
		$scope.limit = 20;
		$scope.moreBeacons = false;
		$scope.puserId = PUser.getCurrentUser().puserId;
		$scope.noBeacons = null;
		$scope.loadingBeacons = null;
		$scope.fromDate = _fromDate.toISOString();
		$scope.toDate = _toDate.toISOString();
		$scope.where = {
			'active': true,
			'startDate': {
				'$gte': {
					'__type': "Date",
					'iso': $scope.fromDate
				},
				'$lte': {
					'__type': "Date",
					'iso': $scope.toDate
				}
			}
		};

		$scope.$on('updateCalendar', function(event, data) {

			$scope.skip = 0;
			$scope.beacons = [];

			var tmpDate = data.fromDate,
				todaysDate = new Date(),
				_fromDate = new Date(tmpDate.setDate(tmpDate.getDate())),
				_toDate = new Date(tmpDate.setDate(tmpDate.getDate()));

			// we only want to show midnight to midnight if the user has not selected "Today"
			if (tmpDate.setHours(0, 0, 0, 0) != todaysDate.setHours(0, 0, 0, 0)) {
				_fromDate.setHours(0, 0, 0); // midnight
			}

			_toDate.setHours(23, 59, 59); // midnight

			$scope.fromDate = _fromDate.toISOString();
			$scope.toDate = _toDate.toISOString();

			$scope.where = {
				'active': true,
				'startDate': {
					'$gte': {
						'__type': "Date",
						'iso': $scope.fromDate
					},
					'$lte': {
						'__type': "Date",
						'iso': $scope.toDate
					}
				}
			};

			$scope.getBeaconChunk();
		});

		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.getBeaconChunk();
		});

		// build the basic query out
		// note that initially we're going to be querying for beacons starting today

		// go grab 20 beacons from the server
		$scope.getBeaconChunk = function(cb) {
/*
			UI.showToast({
				msg: 'retreiving beacons...'
			});
*/
			$scope.loadingBeacons = true;
			Beacon.list({
				limit: $scope.limit,
				skip: $scope.skip,
				'where': JSON.stringify($scope.where)
			}).then(function(response) {
				$scope.loadingBeacons = false;

				// if we have a response, there may be more...
				$scope.moreBeacons = (response.length > $scope.limit)

				// increment the skip counter
				$scope.skip += Math.min(response.length, $scope.limit);

				// add the response to the scope
				if (response.length > 0) {
					$scope.beacons = $scope.beacons.concat(response);
					$scope.noBeacons = false;
				} else {
					$scope.noBeacons = true;
					$scope.beacons = null;
				}

				$scope.$broadcast('scroll.infiniteScrollComplete');

				/*UI.hideToast();*/
				if (cb && typeof cb === 'function') cb.call();

			});
		}

		$scope.refreshBeaconList = function() {
			// we need to reset the skip here as we're resetting the list
			$scope.skip = 0;
			$scope.beacons = [];

			$scope.getBeaconChunk(function() {
				$scope.$broadcast('scroll.refreshComplete');
			});

		}

		$scope.joinBeacon = function(beacon) {
			UI.showToast({
				msg: 'joining beacon...'
			});

			Beacon.updateFireteam(beacon, 'join', $scope.puserId).then(function() {
				UI.hideToast();

				//Utils.getCurrentUser().myBeacons.push(beacon.objectId);

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
				cssClass: 'fade-up',
				title: 'Delete beacon',
				template: 'Are you sure you want to delete your beacon?'
			});
			confirmDel.then(function(res) {
				if (res) {
					UI.showToast({
						msg: 'deleting beacon...'
					});

					Beacon.delete(beacon).then(function() {
						UI.hideToast();

						//Utils.getCurrentUser().myBeacons = _.without(Utils.getCurrentUser().myBeacons, beacon.objectId);

						$state.go('app.beacons', null, {
							reload: true,
							notify: true
						});
					});
				}
			});
		}

		$scope.leaveBeacon = function(beacon) {
			UI.showToast({
				msg: 'leaving beacon...'
			});

			Beacon.updateFireteam(beacon, 'leave').then(function() {
				UI.hideToast();

				//Utils.getCurrentUser().myBeacons = _.without(Utils.getCurrentUser().myBeacons, beacon.objectId);

				$state.go('app.beacons', null, {
					reload: true,
					notify: true
				});
			});
		}

		// watches

		/*		$scope.$watch('beacons', function(newVal, oldVal) {
					if (newVal && $scope.beacons.length > 0) {
						$scope.myBeacons.push(Utils.findMyBeacon($scope.beacons).objectId);
					}
				});
		*/
		// when myBeacons changes, update the currentUser
		/*		$scope.$watch('myBeacons', function(newVal, oldVal) {
					if (newVal && $scope.beacons.length > 0) {
						Utils.getCurrentUser().myBeacons.push(Utils.findMyBeacon($scope.beacons).objectId);
					}
				});




				.factory('beaconDetailData', [
					'$q',
					'$stateParams',
					'Beacon',
					'Chat',
					'UI',
					function($q, $stateParams, Beacon, Chat, UI) {

						return function(beaconId) {

							UI.showToast({
								msg: 'loading beacon...'
							});

							var beacon = Beacon.get(beaconId),
								messages = Chat.list(beaconId);

							return $q.all([beacon, messages]).then(function(results) {
								UI.hideToast();
								return {
									beacon: results[0],
									messages: results[1].results
								};
							});
						}
					}
				])
		*/
	}
})();
