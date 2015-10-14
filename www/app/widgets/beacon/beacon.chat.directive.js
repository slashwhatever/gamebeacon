(function() {

	"user strict";

	angular
		.module('gamebeacon.widgets')
		.directive('beaconChat', beaconChat)

	beaconChat.$inject = ['Utils'];

	function beaconChat(Utils) {

		var directive = {
			restrict: 'AE',
			replace: true,
			require: '^tab',
			templateUrl: 'app/widgets/beacon/beacon.chat.html',
			link: link
		}

		return directive;

		function link(scope, elem, attr, tabsetCtrl) {
			scope.currentUser = Utils.getCurrentUser();
		}

	}
})();
