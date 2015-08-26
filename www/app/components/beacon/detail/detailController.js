angular.module('gamebeacon.beacon.detail.controllers', ['gamebeacon.services'])

.controller('DetailController', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'$ionicPopup',
	'$interval',
	'$ionicActionSheet',
	'beacon',
	'messages',
	'ChatService',
	'UtilsService',
	'Beacon', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $interval, $ionicActionSheet, beacon, messages, ChatService, UtilsService, Beacon) {

	var msgRefresh;

	$scope.beacon = beacon;
	$scope.messages = messages.results;
	$scope.currentUser = UtilsService.getCurrentUser();

	var refreshMessages = function() {
		ChatService.list($scope.beacon.objectId).then(function(response) {
			$scope.messages = response.results;
		})
	};

	var timer = $interval(refreshMessages, 1500000);

	$scope.$on("$destroy", function() {
		if (timer) {
			$interval.cancel(timer);
		}
	});

	$scope.joinBeacon = function(beacon) {
		Beacon.updateFireteam(beacon, 'join').then(function() {
			$scope.myBeacon = beacon.objectId;
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
			title: 'Delete beacon',
			template: 'Are you sure you want to delete your beacon?'
		});
		confirmDel.then(function(res) {
			if (res) {
				Beacon.delete(beacon).then(function() {
					$scope.myBeacon = null;
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
		Beacon.updateFireteam(beacon, 'leave').then(function() {
			$scope.myBeacon = null;
			$state.go('app.beacons', {}, {
				reload: true,
				notify: true
			});
		});
	}

	$scope.guardianAction = function(object) {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Kick guardian',
			cancelText: 'Cancel',
			cancel: function() {
				hideSheet();
			},
			destructiveButtonClicked: function() {
				Beacon.updateFireteam(object, 'kick')
				return true;
			}
		});

	};

}])
