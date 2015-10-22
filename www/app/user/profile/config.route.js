(function() {
	'use strict';
	angular
		.module('gamebeacon.user')
		.run(appRun);

		appRun.$inject = ['routerHelper'];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'app.profile',
			config: {
				url: '/profile/:objectId',
				views: {
					'main-view': {
						templateUrl: 'app/user/profile/profile.html',
						controller: 'ProfileController',
						resolve: { /* @ngInject */
							profile: function($stateParams, PUser) {
								return PUser.get($stateParams.objectId);
							},
							initialData: function(InitialData) {
								return InitialData()
							}
						}
					}
				}
			}
		}];
	}
})();
