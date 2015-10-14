(function() {
	"user strict";

	angular
		.module('gamebeacon.widgets')
		.directive('chat', chat)

	chat.$inject = ['Utils'];

	function chat(Utils) {

		var directive = {
			restrict: 'AE',
			replace: true,
			require: '^tab',
			templateUrl: 'app/widgets/chat.html',
			link: link
		}

		return directive;

		function link(scope, elem, attr, tabsetCtrl) {
			scope.currentUser = Utils.getCurrentUser();
		}

	}
})();
