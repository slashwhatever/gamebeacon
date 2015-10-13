(function() {
	'use strict';

	angular
		.module('gamebeacon')
		.run(appRun);

		appRun.$inject = ['routerHelper'];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'app',
			config: {
				url: '/app',
				templateUrl: 'app/shared/mainView.html',
				abstract: true,
				data: {
					requireLogin: true
				}
			}
		}];
	}
})();