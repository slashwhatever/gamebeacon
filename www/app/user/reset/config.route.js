(function() {
	'use strict';
	angular
		.module('gamebeacon.user')
		.run(appRun);

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
