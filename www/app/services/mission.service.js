(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Mission', Mission);

	Mission.$inject = ['$resource', '$q', '$cacheFactory', 'appConfig', 'Resource'];

	function Mission($resource, $q, $cacheFactory, appConfig, Resource) {
		var cache = $cacheFactory('mission');
		this.missions = [];

		return {
			list: function(params) {
				this.missions = Resource.list('missions', {
					cache: cache,
					params: {
						'order': 'order'
					}
				});
				return this.missions
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.missions.forEach(function(mission) {
					if (mission.objectId === objectId) dfd.resolve(mission)
				})

				return dfd.promise;
			}
		}
	}
})();