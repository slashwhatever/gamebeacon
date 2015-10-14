(function() {

	"use strict";

	angular
		.module('gamebeacon.widgets')
		.directive('beaconHeader', beaconHeader)

	function beaconHeader() {
		var directive = {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/widgets/beacon/beacon.header.html'
		};

		return directive;

	}
})();
