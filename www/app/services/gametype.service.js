(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('GameType', GameType);

	GameType.$inject = ['$resource', '$q', '$cacheFactory', 'appConfig', 'Resource'];

	function GameType($resource, $q, $cacheFactory, appConfig, Resource) {
		var cache = $cacheFactory('gametype');
		this.gametypes = [];

		return {
			list: function(params) {
				this.gametypes = Resource.list('gametypes', {
					cache: cache,
					params: {
						'order': 'order',
						'include': 'missions,missions.levels,missions.checkpoints'
					}
				});
				return this.gametypes
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.gametypes.forEach(function(gametype) {
					if (gametype.objectId === objectId) dfd.resolve(gametype)
				})

				return dfd.promise;
			}
		}
	}
})();
