(function() {
	'use strict';

	angular
		.module('gamebeacon.core')
		.factory('Profile', Profile);

	Profile.$inject = ['$q', '$stateParams', 'PUser'];

	function Profile($q, $stateParams, PUser) {

		var me = this,
			Profile = $resource(appConfig.parseRestBaseUrl + 'classes/puser/:objectId', {
				objectId: '@objectId'
			}, {
				get: {
					headers: appConfig.parseHttpsHeaders,
					params: {
						'include': 'gametype,platform,mission,checkpoint,region,level,creator,fireteamOnboard,mic'
					}
				},
		return {
			get: function(objectId) {

			}
		}
		return function(objectId) {

			var profile = PUser.get(objectId);

			return $q.all([profile]).then(function(results) {
				return {
					beacon: results[0],
					messages: results[1].results
				};
			});
		}
	}
})();
