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
			state: 'app.beacon',
			config: {
				url: '/beacon-create',
				templateUrl: 'app/beacon/create/create.html',
				controller: 'Create',
				resolve: {
					initialData: function(listControllerInitialData) {
						return listControllerInitialData()
					}
				}
			}
		}];
	}
})();