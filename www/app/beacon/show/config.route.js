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
				url: '/beacon/:beaconId',
				views: {
					'main-view': {
						templateUrl: 'app/beacon/show/show.html',
						controller: 'ShowController',
						resolve: {
							beaconDetails: function($stateParams, BeaconDetail) {
								return BeaconDetail($stateParams.beaconId)
							}
						}
					}
				}
			}
		}];
	}
})();
