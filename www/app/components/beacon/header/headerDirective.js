angular.module('gamebeacon.beacon.header.directives', [])

.directive('beaconHeader', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/beacon/header/headerView.html'
	};
}])