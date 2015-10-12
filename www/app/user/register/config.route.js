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
			state: 'signup',
			config: {
				url: '/register',
				templateUrl: 'app/user/register/register.html',
				controller: 'RegisterController',
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