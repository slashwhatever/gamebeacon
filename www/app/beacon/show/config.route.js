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
				url: '/beacons/:beaconId',
				views: {
					'main-view': {
						templateUrl: 'app/beacon/detail/show.html',
						controller: 'ShowController',
						resolve: {
							beaconDetails: function($stateParams, beaconDetailData) {
								return beaconDetailData($stateParams.beaconId)
							}
						}
					}
				}
			}
		}];
	}
})();
