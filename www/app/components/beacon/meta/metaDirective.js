angular.module('destinybuddy.beacon.meta.directives', [])

.directive('beaconMeta', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/beacon/meta/meta.html'
	};
}])
