(function() {

	"use strict";

	angular
		.module('gamebeacon.widgets')
		.directive('beaconMeta', beaconMeta)

	function beaconMeta() {
		var directive = {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/widgets/beacon/beacon.meta.html'
		};

		return directive;

	}
})();
