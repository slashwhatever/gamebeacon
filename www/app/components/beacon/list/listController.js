angular.module('gamebeacon.beacon.list.controllers', ['gamebeacon.service'])

.factory('listControllerInitialData', [
	'$q',
	'GameType',
	'Mission',
	'Level',
	'Checkpoint',
	'Platform',
	'Region',
	'Mic',
	'Resource',
	'UI',
	function($q, GameType, Mission, Level, Checkpoint, Platform, Region, Mic, Resource, UI) {

		return function() {

			UI.showToast({
				msg: 'loading resources...'
			});

			var gametypes = GameType.list(),
				missions = Mission.list(),
				levels = Level.list(),
				checkpoints = Checkpoint.list(),
				platforms = Platform.list(),
				regions = Region.list(),
				mics = Mic.list();

			return $q.all([gametypes, missions, levels, checkpoints, platforms, regions, mics]).then(function(results) {
				UI.hideToast();
				return {
					gametypes: results[0].results,
					missions: results[1].results,
					levels: results[2].results,
					checkpoints: results[3].results,
					platforms: results[4].results,
					regions: results[5].results,
					mics: results[6].results
				};
			});
		}
	}
])

.factory('beaconDetailData', [
	'$q',
	'$stateParams',
	'Beacon',
	'ChatService',
	'UI',
	function($q, $stateParams, Beacon, ChatService, UI) {

		return function(beaconId) {

			UI.showToast({
				msg: 'loading beacon...'
			});

			var beacon = Beacon.get(beaconId),
				messages = ChatService.list(beaconId);

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

.controller('ListController', [
	'$scope',
	'$rootScope',
	'$state',
	'$ionicPopup',
	'UI',
	'Beacon',
	'Utils',
	'appConfig',
	'listControllerInitialData',
	function($scope, $rootScope, $state, $ionicPopup, UI, Beacon, Utils, appConfig, listControllerInitialData) {

		var today = new Date(),
			_fromDate = new Date(today.setDate(today.getDate())),
			_toDate = new Date(today.setDate(today.getDate()));

		//_fromDate.setHours(0, 0, 0);			// midnight
		_toDate.setHours(23, 59, 59);			// midnight


		$scope.myBeacons = [];
		$scope.beacons = [];
		$scope.skip = 0;
		$scope.limit = 20;
		$scope.moreBeacons = false;
		$scope.puserId = Utils.getCurrentUser().puserId;
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
				}, '$lte': {
					'__type': "Date",
					'iso': $scope.toDate
				}
			}
		};

		$scope.$on('updateCalendar', function (event, data) {

			$scope.skip = 0;
			$scope.beacons = [];

			var tmpDate = data.fromDate, todaysDate = new Date(),
				_fromDate = new Date(tmpDate.setDate(tmpDate.getDate())),
				_toDate = new Date(tmpDate.setDate(tmpDate.getDate()));

				// we only want to show midnight to midnight if the user has not selected "Today"
			if(tmpDate.setHours(0,0,0,0) != todaysDate.setHours(0,0,0,0)) {
				_fromDate.setHours(0, 0, 0);			// midnight
			}

			_toDate.setHours(23, 59, 59);			// midnight

			$scope.fromDate = _fromDate.toISOString();
			$scope.toDate = _toDate.toISOString();

			$scope.where = {
				'active': true,
				'startDate': {
					'$gte': {
						'__type': "Date",
						'iso': $scope.fromDate
					}, '$lte': {
						'__type': "Date",
						'iso': $scope.toDate
					}
				}
			};

			$scope.getBeaconChunk();
		});

		$scope.$on('$ionicView.beforeEnter', function() {
			listControllerInitialData();
			$scope.getBeaconChunk();
		});

		// build the basic query out
		// note that initially we're going to be querying for beacons starting today

		// go grab 20 beacons from the server
		$scope.getBeaconChunk = function(cb) {

			UI.showToast({
				msg: 'retreiving beacons...'
			});

			$scope.loadingBeacons = true;
			Beacon.list({
				limit: $scope.limit,
				skip: $scope.skip,
				'where': JSON.stringify($scope.where)
			}).then(function(response) {
				$scope.loadingBeacons = false;

				// if we have results, there may be more...
				$scope.moreBeacons = (response.results.length > $scope.limit)

				// increment the skip counter
				$scope.skip += Math.min(response.results.length, $scope.limit);

				// add the results to the scope
				if (response.results.length > 0) {
					$scope.beacons = $scope.beacons.concat(response.results);
					$scope.noBeacons = false;
				} else {
					$scope.noBeacons = true;
					$scope.beacons = null;
				}

				$scope.$broadcast('scroll.infiniteScrollComplete');

				UI.hideToast();
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

				Utils.getCurrentUser().myBeacons.push(beacon.objectId);

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
				cssClass: 'gb-popup',
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

						Utils.getCurrentUser().myBeacons = _.without(Utils.getCurrentUser().myBeacons, beacon.objectId);

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

				Utils.getCurrentUser().myBeacons = _.without(Utils.getCurrentUser().myBeacons, beacon.objectId);

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
*/
	}
])
