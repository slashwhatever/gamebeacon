angular.module('gamebeacon.beacon.create.controllers', ['gamebeacon.services'])

.controller('CreateController', [
	'$scope',
	'$rootScope',
	'$state',
	'initialData',
	'Beacon',
	'UtilsService',
	'PushService',
	'MsgService',
	'$ionicSlideBoxDelegate',
	'$timeout',
	'$ionicScrollDelegate',
	function($scope, $rootScope, $state, initialData, Beacon, UtilsService, PushService, MsgService, $ionicSlideBoxDelegate, $timeout, $ionicScrollDelegate) {

		// Called when the form is submitted
		$scope.createBeacon = function(startTime) {
			var hasLevel = $scope.levels ? $scope.levels.length > 0 : false,
				hasCheckpoint = $scope.checkpoints ? $scope.checkpoints.length > 0 : false,
				startTimeDate = new Date(new Date(startTime).getTime(),
				pushTime = startTimeDate - 15 * 60000),
				pushExpirationTime = startTimeDate;


			Beacon.save({
				'mission': UtilsService.getObjectAsPointer('missions', $scope.missions[$ionicSlideBoxDelegate.$getByHandle('mission-selector').currentIndex()].objectId),
				'checkpoint': hasCheckpoint ? UtilsService.getObjectAsPointer('checkpoints', $scope.checkpoints[$ionicSlideBoxDelegate.$getByHandle('checkpoint-selector').currentIndex()].objectId) : null,
				'mic': UtilsService.getObjectAsPointer('mics', $scope.mics[$ionicSlideBoxDelegate.$getByHandle('mic-selector').currentIndex()].objectId),
				'level': hasLevel ? UtilsService.getObjectAsPointer('levels', $scope.levels[$ionicSlideBoxDelegate.$getByHandle('level-selector').currentIndex()].objectId) : null,
				'fireteamRequired': $ionicSlideBoxDelegate.$getByHandle('fireteam-selector').currentIndex() + 1,
				'fireteamOnboard': [UtilsService.getObjectAsPointer('pusers', UtilsService.getCurrentUser().puserId)],
				'platform': UtilsService.getObjectAsPointer('platforms', $scope.platforms[$ionicSlideBoxDelegate.$getByHandle('platform-selector').currentIndex()].objectId),
				'region': UtilsService.getObjectAsPointer('regions', $scope.regions[$ionicSlideBoxDelegate.$getByHandle('region-selector').currentIndex()].objectId),
				'creator': UtilsService.getObjectAsPointer('pusers', UtilsService.getCurrentUser().puserId),
				'startDate': {
					"__type": "Date",
					"iso": startTime
				},
				'active': true
			}).then(function(response) {

				// subscribe the user to a channel for this beacon
				PushService.subscribe({
					channel: 'OWNER' + response.objectId,
					puserId: UtilsService.getCurrentUser().puserId
				});

				// if the beacon was created, create a scheduled push that will go to all subscribers of the OWNERxxx and MEMBERxxx channels
				// by setting up the two pushes now, we can just sub and unsub people later to get the messages
				PushService.sendPush({
					channels: ['OWNER' + response.objectId],
					push_time: pushTime,
					expiration_time: pushExpirationTime,
					alert: MsgService.msg('createBeacon')
				});

				PushService.sendPush({
					channels: ['MEMBER' + response.objectId],
					push_time: pushTime,
					expiration_time: pushExpirationTime,
					alert: MsgService.msg('joinedBeacon')
				});

				$state.go('app.beacons', null, {
					reload: true,
					notify: true
				});
			})
		};

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
		$scope.missions = initialData.missions;
		$scope.platforms = initialData.platforms;
		$scope.regions = initialData.regions;
		$scope.checkpoints = initialData.missions[0].checkpoints ? initialData.missions[0].checkpoints : null;
		$scope.mics = initialData.mics;
		$scope.levels = initialData.missions[0].levels ? initialData.missions[0].levels : null;
		$scope.maxFireteam = $scope.getMaxFireTeam(initialData.missions[0]);
		$scope.currentUser = UtilsService.getCurrentUser();
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

		$ionicSlideBoxDelegate.update();

		$timeout(function() {
			$ionicScrollDelegate.scrollTop();
		}, 50);

	}
])
