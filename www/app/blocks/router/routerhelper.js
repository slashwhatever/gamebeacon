// routerHelperProvider.js
angular
	.module('blocks.router')
	.provider('routerHelper', routerHelperProvider);

routerHelperProvider.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$route', '$urlRouterProvider'];
/* @ngInject */
function routerHelperProvider($stateProvider, $urlRouterProvider, $locationProvider, $route, $urlRouterProvider) {

	/* jshint validthis:true */
	this.$get = RouterHelper;

	//$locationProvider.html5Mode(true);

	RouterHelper.$inject = ['$state'];
	/* @ngInject */
	function RouterHelper($state) {
		var hasOtherwise = false,
			_otherwisePath = '/beacons',
			service = {
				configureStates: configureStates,
				getStates: getStates
			};

		return service;

		///////////////

		function configureStates(states, otherwisePath) {
			var otherPath = otherwisePath || _otherwisePath;

			states.forEach(function(state) {
				$stateProvider.state(state.state, state.config);
			});
			if (otherPath && !hasOtherwise) {
				hasOtherwise = true;
				$urlRouterProvider.otherwise(otherPath);
				$urlRouterProvider.when('', otherPath);

			}
		}

		function getStates() {
			return $state.get();
		}
	}
}
