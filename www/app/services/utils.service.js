(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Utils', Utils);

	Utils.$inject = ['appConfig', '$rootScope'];

	function Utils(appConfig, $rootScope) {

		var funcs = {
			userOnboard: function(beacon) {
				return _.findIndex(beacon.fireteamOnboard, function(i) {
					// is the current user in the list of fireteam members?
					return i ? funcs.getCurrentUser().puserId == i.objectId : false
				}) > -1
			},
			findMyBeacon: function(beacons) {
				var isCreator = _.findWhere(beacons, {
					userIsCreator: true
				});
				var isOnboard = _.findWhere(beacons, {
					alreadyOnboard: true,
					userIsCreator: false
				});

				return isCreator || isOnboard || undefined
			},
			getObjectAsPointer: function(className, objectId) {
				return {
					"__type": "Pointer",
					"className": className,
					"objectId": objectId
				}
			},
			getObjectAsFile: function(fileName) {
				return {
					"__type": "File",
					"name": fileName
				}
			},
			getCurrentUser: function() {
				return $rootScope.currentUser
			},
			getPlatformIcon: function(platform) {
				switch (platform.toLowerCase()) {
					case 'playstation 3':
						return 'ion-playstation ps3';
						break;

					case 'playstation 4':
						return 'ion-playstation ps4';
						break;

					case 'xbox one':
						return 'ion-xbox one';
						break;

					case 'xbox 360':
						return 'ion-xbox 360';
						break;
				}
			}
		};

		return funcs
	}
})();
