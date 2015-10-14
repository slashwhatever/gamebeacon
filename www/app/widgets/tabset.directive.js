(function() {
	'use strict';

	angular
		.module('gamebeacon.widgets')
		.directive('tab', tab)
		.directive('tabset', tabset);

	/* @ngInject */
	function tab($window) {
		var directive = {
			restrict: 'E',
			transclude: true,
			require: '^tabset',
			template: '<div role="tabpanel" ng-if="active" ng-transclude class="padding"></div>',
			scope: {
				heading: '@'
			},
			controller: function() {
				//Empty controller so other directives can require being 'under' a tab
			},
			link: link
		};

		return directive;

		function link(scope, elem, attr, tabsetCtrl) {
			scope.active = false;
			tabsetCtrl.addTab(scope)
		}
	}

	function tabset($window) {
		var directive = {
			restrict: 'E',
			transclude: true,
			scope: {},
			templateUrl: 'app/widgets/tabset.html',
			bindToController: true,
			controllerAs: 'tabset',
			controller: controller
		};

		return directive;

		function controller() {
			var self = this;
			self.tabs = [];

			self.addTab = function addTab(tab) {
				self.tabs.push(tab)

				if (self.tabs.length === 1) {
					tab.active = true
				}
			}

			self.select = function(selectedTab) {
				angular.forEach(self.tabs, function(tab) {
					if (tab.active && tab !== selectedTab) {
						tab.active = false;
					}
				})

				selectedTab.active = true;
			}
		}
	}
})();
