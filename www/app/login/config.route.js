(function() {
	'use strict';

	angular
		.module('gamebeacon.login')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [{
			state: 'login',
			config: {
				url: '/login',
				templateUrl: 'app/login/login.html',
				controller: 'Login',
				data: {
					requireLogin: false
				}
			}
		}];
	}
})();