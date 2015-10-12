(function() {
	'use strict';
	angular
		.module('gamebeacon.beacon')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'app.beacons',
			config: {
				url: '/beacons',
				views: {
					'main-view': {
						templateUrl: 'app/beacon/list/list.html',
						controller: 'List',
						resolve: {
							initialData: function(ListInitialData) {
								return ListInitialData()
							}
						}
					}
				}
			}
		}];
	}
})();