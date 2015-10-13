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
				url: '/profile',
				views: {
					'main-view': {
						templateUrl: 'app/user/profile/profile.html',
						controller: 'UserProfile',
						resolve: {
							initialData: function(listControllerInitialData) {
								return listControllerInitialData()
							}
						}
					}
				}
			}
		}];
	}
})();
