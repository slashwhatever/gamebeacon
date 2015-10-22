(function() {
	'use strict';
	angular
		.module('gamebeacon.beacon')
		.run(appRun);

		appRun.$inject = ['routerHelper'];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'beacon-create',
			config: {
				url: '/beacon-create',
				templateUrl: 'app/beacon/create/create.html',
				controller: 'CreateController',
				resolve: { /* @ngInject */
					initialData: function(InitialData) {
						return InitialData()
					}
				}
			}
		}];
	}
})();