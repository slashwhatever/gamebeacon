angular.module('destinybuddy.beaconmeta.directives', [])

.directive('beaconMeta', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/components/beacon/meta/meta.html'
	};
}])
