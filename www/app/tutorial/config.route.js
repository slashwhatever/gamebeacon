(function() {
	'use strict';
	angular
		.module('gamebeacon.tutorial')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'tutorial',
			config: {
				url: '/',
				templateUrl: 'app/tutorial/tutorial.html',
				controller: 'Tutorial'
			}
		}];
	}
})();