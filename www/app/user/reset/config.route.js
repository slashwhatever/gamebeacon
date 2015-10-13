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
			state: 'reset-password',
			config: {
				url: '/reset-password',
				templateUrl: 'app/user/reset/resetpassword.html',
				controller: 'Reset'
			}
		}];
	}
})();
