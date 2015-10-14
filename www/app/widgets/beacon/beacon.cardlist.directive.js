(function() {
	"user strict";

	angular
		.module('gamebeacon.widgets')
		.directive('beaconCardList', beaconCardList)

	beaconCardList.$inject = ['Utils', '$ionicActionSheet'];

	function beaconCardList(Utils, $ionicActionSheet) {

		var directive = {
			restrict: 'E',
			replace: true,
			scope: {
				beacons: '=',
			},
			templateUrl: 'app/widgets/beacon/beacon.cardlist.html'
		}

		return directive;
	}
})();
