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
			state: 'signup',
			config: {
				url: '/register',
				templateUrl: 'app/user/register/register.html',
				controller: 'RegisterController',
				//TODO: combine these into a single promise service
				resolve: { /* @ngInject */
					platforms: function(Resource) {
						return Resource.list('platforms')
					}, /* @ngInject */
					regions: function(Resource) {
						return Resource.list('regions')
					}, /* @ngInject */
					mics: function(Resource) {
						return Resource.list('mics')
					}
				}
			}
		}];
	}
})();