(function() {
	'use strict';
	angular
		.module('gamebeacon.tutorial')
		.run(appRun);

		appRun.$inject = ['routerHelper'];

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
				controller: 'TutorialController'
			}
		}];
	}
})();