angular.module('destinybuddy.beaconheader.directives', [])

.directive('beaconHeader', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/beacon/header/headerView.html'
	};
}])