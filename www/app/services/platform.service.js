(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Platform', Platform);

	Platform.$inject = ['$resource', '$q', '$cacheFactory', 'appConfig', 'Resource'];

	function Platform($resource, $q, $cacheFactory, appConfig, Resource) {

		var cache = $cacheFactory('platform');
		this.platforms = [];

		return {
			list: function(params) {
				this.platforms = Resource.list('platforms', {
					cache: cache
				});
				return this.platforms
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.platforms.forEach(function(platform) {
					if (platform.objectId === objectId) dfd.resolve(platform)
				})

				return dfd.promise;
			}
		}
	}
})();