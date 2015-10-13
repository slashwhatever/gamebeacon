(function() {
	'use strict';
	angular
		.module('gamebeacon.dashboard')
		.run(appRun);

		appRun.$inject = ['routerHelper'];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'app.dashboard',
			config: {
				url: '/dashboard/:puserId',
				views: {
					'main-view': {
						templateUrl: 'app/dashboard/dashboard.html',
						controller: 'Dashboard'
					}
				}
			}
		}];
	}
})();
