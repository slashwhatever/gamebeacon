(function() {

	"use strict";

	angular
		.module('gamebeacon.user')
		.directive('onValidSubmit', onValidSubmit)

	onValidSubmit.$inject = ['$parse', '$timeout']

	function onValidSubmit($parse, $timeout) {
		var directive = {
			require: '^form',
			restrict: 'A',
			link: link
		};

		return directive;

		function link(scope, element, attrs, form) {
			form.$submitted = false;
			var fn = $parse(attrs.onValidSubmit);
			element.on('submit', function(event) {
				scope.$apply(function() {
					element.addClass('ng-submitted');
					form.$submitted = true;
					if (form.$valid) {
						if (typeof fn === 'function') {
							fn(scope, {
								$event: event
							});
						}
					}
				});
			});
		}
	}
})();
