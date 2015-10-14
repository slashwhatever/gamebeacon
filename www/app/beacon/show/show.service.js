(function() {
	'use strict';

	angular
		.module('gamebeacon.core')
		.factory('BeaconDetail', BeaconDetail);

	BeaconDetail.$inject = ['$q', '$stateParams', 'Beacon', 'Chat', 'UI'];

	function BeaconDetail($q, $stateParams, Beacon, Chat, UI) {
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
})();
