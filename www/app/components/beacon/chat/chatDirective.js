angular.module('destinybuddy.beacon.chat.directives', [])

.directive('beaconChat', ['UtilsService', function(UtilsService) {
	return {
		restrict: 'AE',
		replace: true,
		require: '^tab',
		templateUrl: 'app/components/beacon/chat/chatView.html',
		link: function(scope, elem, attr, tabsetCtrl) {
			scope.currentUser = UtilsService.getCurrentUser();
		}
	}
}])
