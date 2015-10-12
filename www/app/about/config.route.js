(function() {
	'use strict';
	angular
		.module('gamebeacon.about')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'app.about',
			config: {
				url: '/about',
				views: {
					'main-view': {
						templateUrl: 'app/about/about.html'
					}
				}
			}
		}];
	}
})();