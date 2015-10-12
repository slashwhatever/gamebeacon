(function() {
	'use strict';

	angular
		.module('gamebeacon.beacon')
		.controller('Show', Show);

	Show.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPopup', '$interval', '$ionicActionSheet', 'ChatService', 'Utils', 'Beacon', 'beaconDetails'];

	function Show($scope, $rootScope, $state, $stateParams, $ionicPopup, $interval, $ionicActionSheet, ChatService, Utils, Beacon, beaconDetails) {

		var msgRefresh;

		$scope.beacon = beaconDetails.beacon;
		$scope.messages = beaconDetails.messages;
		$scope.puserId = Utils.getCurrentUser().puserId;

		var refreshMessages = function() {
			ChatService.list($scope.beacon.objectId).then(function(response) {
				$scope.messages = response.results;
			})
		};

		var timer = $interval(refreshMessages, 1500000);

		$scope.$on('$ionicView.beforeLeave', function() {
			if (timer) {
				$interval.cancel(timer);
			}
		});

		$scope.joinBeacon = function(beacon) {
			Beacon.updateFireteam(beacon, 'join', $scope.puserId).then(function() {
				Utils.getCurrentUser().myBeacons.push(beacon.objectId);
				$state.go($state.current, {
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
					Beacon.delete(beacon).then(function() {
						$scope.myBeacons = _.without($scope.myBeacons, beacon.beaconId); // this should remove the beacon from the array
						$state.go('app.beacons', {}, {
							reload: true,
							notify: true
						});
					});
				}
			});
		}

		$scope.sendMessage = function() {
			var msg = this.newMessage;
			this.newMessage = null; // clear the text entry box
			ChatService.save(msg, $scope.beacon.objectId).then(function(response) {

				// add a new item to the messages list (this will get replaced with the proper version on refresh)
				refreshMessages();
			})
		}

		$scope.leaveBeacon = function(beacon) {
			Beacon.updateFireteam(beacon, 'leave', $scope.puserId).then(function() {
				$scope.myBeacons = _.without($scope.myBeacons, beacon.beaconId); // this should remove the beacon from the array
				$state.go('app.beacons', {}, {
					reload: true,
					notify: true
				});
			});
		}
	}
})();
