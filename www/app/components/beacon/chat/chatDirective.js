angular.module('destinybuddy.beaconchat.directives', [])

.directive('beaconChat', [function() {
	return {
		restrict: 'AE',
		replace: true,
		require: '^tab',
		templateUrl: 'app/components/beacon/chat/chatView.html'
	}
}])
