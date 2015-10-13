(function() {
	'use strict';

	angular
		.module('blocks.router')
		.provider('routerHelper', routerHelperProvider);

	routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
	/* @ngInject */
	function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
		/* jshint validthis:true */
		this.$get = RouterHelper;

		//$locationProvider.html5Mode(true);

		RouterHelper.$inject = ['$state'];
		/* @ngInject */
		function RouterHelper($state) {
			var hasOtherwise = false;

			var service = {
				configureStates: configureStates,
				getStates: getStates
			};

			return service;

			///////////////

			function configureStates(states, otherwisePath) {

				var otherwise = otherwisePath || '/login';

				states.forEach(function(state) {
					console.log(state)
					$stateProvider.state(state.state, state.config);
				});
				if (otherwise && !hasOtherwise) {
					hasOtherwise = true;
					$urlRouterProvider.otherwise(otherwise);
				}
			}

			function getStates() {
				return $state.get();
			}
		}
	}

})();
