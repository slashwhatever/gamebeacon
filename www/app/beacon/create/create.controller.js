(function() {
	'use strict';

	angular
		.module('gamebeacon.beacon')
		.controller('CreateController', CreateController);

	CreateController.$inject = ['$scope', '$state', 'initialData', 'Beacon', 'Utils', 'Push', 'Msg', 'UI', '$ionicSlideBoxDelegate', '$timeout', '$ionicScrollDelegate', 'PUser'];

	function CreateController($scope, $state, initialData, Beacon, Utils, Push, Msg, UI, $ionicSlideBoxDelegate, $timeout, $ionicScrollDelegate, PUser) {

		$scope.updateGameType = updateGameType;
		$scope.updateMission = updateMission;
		$scope.getMaxFireTeam = getMaxFireTeam;

		// define all the starting variables for the view
		$scope.gametypes = initialData.gametypes;
		$scope.missions = $scope.gametypes[0].missions ? $scope.gametypes[0].missions : null;
		$scope.checkpoints = $scope.missions && $scope.missions[0].checkpoints ? $scope.missions[0].checkpoints : null;
		$scope.levels = $scope.missions && $scope.missions[0].levels ? $scope.missions[0].levels : null;

		$scope.platforms = initialData.platforms;
		$scope.regions = initialData.regions;
		$scope.mics = initialData.mics;
		$scope.maxFireteam = $scope.getMaxFireTeam(initialData.missions[0]);
		$scope.currentUser = PUser.getCurrentUser();
		//$scope.startTime = new Date().getTime();

		// set the starting slides for the mic, platform and region
		$scope.defaultMic = _.findIndex($scope.mics, {
			objectId: $scope.currentUser.mic.objectId
		});

		$scope.defaultPlatform = _.findIndex($scope.platforms, {
			objectId: $scope.currentUser.platform.objectId
		});

		$scope.defaultRegion = _.findIndex($scope.regions, {
			objectId: $scope.currentUser.region.objectId
		});

		// Called when the form is submitted
		$scope.createBeacon = function(startTime) {

			UI.showToast({
				msg: 'saving beacon...'
			});

			var hasLevel = $scope.levels ? $scope.levels.length > 0 : false,
				hasCheckpoint = $scope.checkpoints ? $scope.checkpoints.length > 0 : false,
				rawStartTime = new Date(startTime).getTime(),
				startTimeDate = new Date(rawStartTime),
				pushTime = new Date(rawStartTime - (15 * 60000)),
				pushExpirationTime = startTimeDate;

			// quick validation on date - make sure it's not in the past
			if (new Date(startTime).getTime() > new Date().getTime()) {
				Beacon.save({
					'gametype': Utils.getObjectAsPointer('gametypes', $scope.gametypes[$ionicSlideBoxDelegate.$getByHandle('gametype-selector').currentIndex()].objectId),
					'mission': Utils.getObjectAsPointer('missions', $scope.missions[$ionicSlideBoxDelegate.$getByHandle('mission-selector').currentIndex()].objectId),
					'checkpoint': hasCheckpoint ? Utils.getObjectAsPointer('checkpoints', $scope.checkpoints[$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').currentIndex()].objectId) : null,
					'mic': Utils.getObjectAsPointer('mics', $scope.mics[$ionicSlideBoxDelegate.$getByHandle('mic-selector').currentIndex()].objectId),
					'level': hasLevel ? Utils.getObjectAsPointer('levels', $scope.levels[$ionicSlideBoxDelegate.$getByHandle('level-selector').currentIndex()].objectId) : null,
					'fireteamRequired': $ionicSlideBoxDelegate.$getByHandle('fireteam-selector').currentIndex() + 1,
					'fireteamOnboard': [Utils.getObjectAsPointer('pusers', PUser.getCurrentUser().puserId)],
					'platform': Utils.getObjectAsPointer('platforms', $scope.platforms[$ionicSlideBoxDelegate.$getByHandle('platform-selector').currentIndex()].objectId),
					'region': Utils.getObjectAsPointer('regions', $scope.regions[$ionicSlideBoxDelegate.$getByHandle('region-selector').currentIndex()].objectId),
					'creator': Utils.getObjectAsPointer('pusers', PUser.getCurrentUser().puserId),
					'startDate': {
						"__type": "Date",
						"iso": startTime
					},
					'active': true
				}).then(function(response) {
					UI.hideToast();

					// subscribe the user to a channel for this beacon
					Push.subscribe({
						channel: 'OWNER' + response.objectId,
						puserId: PUser.getCurrentUser().puserId
					});

					// if the beacon was created, create a scheduled push that will go to all subscribers of the OWNERxxx and MEMBERxxx channels
					// by setting up the two pushes now, we can just sub and unsub people later to get the messages
					Push.sendPush({
						channels: ['OWNER' + response.objectId],
						push_time: pushTime,
						expiration_time: pushExpirationTime,
						alert: Msg.msg('createBeacon')
					});

					Push.sendPush({
						channels: ['MEMBER' + response.objectId],
						push_time: pushTime,
						expiration_time: pushExpirationTime,
						alert: Msg.msg('joinedBeacon')
					});

					$state.go('app.beacons', null, {
						reload: true,
						notify: true
					});
				}, function() {
					UI.hideToast();
				})
			} else {
				UI.showAlert({
					title: 'Oops!',
					template: 'You can\'t create a beacon in the past.'
				})
			}
		};

		$scope.$watch('missions', function(newVal, oldVal) {
			if (newVal) {
				$ionicSlideBoxDelegate.$getByHandle('mission-selector').slide(0, 100);
				$ionicSlideBoxDelegate.$getByHandle('mission-selector').update();
			}
		});

		$scope.$watch('levels', function(newVal, oldVal) {
			if (newVal) {
				$ionicSlideBoxDelegate.$getByHandle('level-selector').slide(0, 100);
				$ionicSlideBoxDelegate.$getByHandle('level-selector').update();
			}
		});

		$scope.$watch('checkpoints', function(newVal, oldVal) {
			if (newVal) {
				$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').slide(0, 100);
				$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').update();
			}
		});

		$scope.$watch('maxFireteam', function(newVal, oldVal) {
			if (newVal) {
				$ionicSlideBoxDelegate.$getByHandle('fireteam-selector').slide(0, 100);
				$ionicSlideBoxDelegate.$getByHandle('fireteam-selector').update();
			}
		});

		$ionicSlideBoxDelegate.update();

		$timeout(function() {
			$ionicScrollDelegate.scrollTop();
		}, 50);

		function updateGameType (index) {
			var gametype = $scope.gametypes[$ionicSlideBoxDelegate.$getByHandle('gametype-selector').currentIndex()]

			$scope.missions = gametype.missions || [];
			$scope.levels = $scope.missions ? $scope.missions.levels || [] : null;
			$scope.checkpoints = $scope.missions ? $scope.missions.checkpoints || [] : null;

			$scope.maxFireteam = $scope.getMaxFireTeam($scope.missions[0])
		}

		function updateMission(index) {
			var mission = $scope.missions[$ionicSlideBoxDelegate.$getByHandle('mission-selector').currentIndex()]
			var levels = mission.levels;
			var checkpoints = mission.checkpoints;
			$scope.levels = levels ? levels : [];
			$scope.checkpoints = checkpoints ? checkpoints : [];
			$scope.maxFireteam = $scope.getMaxFireTeam(mission)
		}

		function getMaxFireTeam(mission) {
			return _.range(1, mission.maxFireteam)
		}

	}
})();
