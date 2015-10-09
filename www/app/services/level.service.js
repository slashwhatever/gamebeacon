(function() {
	'use strict';

	angular
		.module('gamebeacon.service')
		.factory('Level', Level);

	Level.$inject = ['$resource', '$q', '$cacheFactory', 'appConfig', 'Resource'];

	function Level($resource, $q, $cacheFactory, appConfig, Resource) {
		var cache = $cacheFactory('level');
		this.levels = [];

		return {
			list: function(params) {
				this.levels = Resource.list('levels', {
					cache: cache
				});
				return this.levels
			},
			get: function(objectId) {
				var dfd = $q.defer()
				this.levels.forEach(function(level) {
					if (level.objectId === objectId) dfd.resolve(level)
				})

				return dfd.promise;
			}
		}
	}
})();
