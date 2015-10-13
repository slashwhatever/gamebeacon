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
				controller: 'Register',
				//TODO: combine these into a single promise service
				resolve: {
					platforms: function(Resource) {
						return Resource.list('platforms')
					},
					regions: function(Resource) {
						return Resource.list('regions')
					},
					mics: function(Resource) {
						return Resource.list('mics')
					}
				}
			}
		}];
	}
})();